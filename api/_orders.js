// Pedidos con pago en línea. El repo es público, así que los pedidos (nombres, direcciones,
// teléfonos) se guardan CIFRADOS en data/orders.enc.json con la llave ORDERS_KEY de Vercel.
import crypto from 'crypto';
import { readJson, updateJson } from './_github.js';

const FILE = 'data/orders.enc.json';
const MAX_ORDERS = 1500;

function key() {
  const k = process.env.ORDERS_KEY;
  if (!k || k.length < 24) throw new Error('Falta la variable ORDERS_KEY en Vercel (mínimo 24 caracteres)');
  return crypto.createHash('sha256').update(k).digest();
}

function encrypt(list) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(list), 'utf8'), cipher.final()]);
  return { v: 1, iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), data: data.toString('base64') };
}

function decrypt(box) {
  if (!box || !box.data) return [];
  const decipher = crypto.createDecipheriv('aes-256-gcm', key(), Buffer.from(box.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(box.tag, 'base64'));
  const plain = Buffer.concat([decipher.update(Buffer.from(box.data, 'base64')), decipher.final()]);
  return JSON.parse(plain.toString('utf8'));
}

export async function listOrders() {
  const { data } = await readJson(FILE, null);
  return decrypt(data);
}

export async function getOrder(folio) {
  return (await listOrders()).find((o) => o.folio === folio) || null;
}

/**
 * Cambia un pedido de forma segura. `mutate(order)` puede lanzar un error o devolver false para
 * no guardar nada. Si dos avisos llegan al mismo tiempo, GitHub rechaza el segundo (sha distinto),
 * se vuelve a leer y `mutate` corre otra vez con el pedido ya actualizado: así no se hacen dos guías.
 */
export async function updateOrder(folio, mutate, message) {
  let result = null;
  let changed = false;
  try {
    await updateJson(FILE, async (box) => {
      const list = decrypt(box);
      const order = list.find((o) => o.folio === folio);
      if (!order) throw Object.assign(new Error('Pedido no encontrado'), { status: 404 });
      changed = (await mutate(order)) !== false;
      result = order;
      if (!changed) throw Object.assign(new Error('sin cambios'), { noop: true });
      order.updatedAt = new Date().toISOString();
      return encrypt(list);
    }, message || `Pedido ${folio}`, null);
  } catch (err) {
    if (!err.noop) throw err;
  }
  return { order: result, changed };
}

export async function addOrder(order) {
  await updateJson(FILE, (box) => {
    const list = decrypt(box);
    list.unshift(order);
    return encrypt(list.slice(0, MAX_ORDERS));
  }, `Pedido nuevo ${order.folio}`, null);
  return order;
}

export function newFolio() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `PH-${ymd}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

export const newAccessToken = () => crypto.randomBytes(16).toString('hex');

/** Firma corta con la misma llave, para que la cotización de envío no se pueda alterar. */
export function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const mac = crypto.createHmac('sha256', key()).update(body).digest('base64url');
  return `${body}.${mac}`;
}

export function verify(token) {
  const [body, mac] = String(token || '').split('.');
  if (!body || !mac) return null;
  const expected = crypto.createHmac('sha256', key()).update(body).digest('base64url');
  if (mac.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return null;
  try { return JSON.parse(Buffer.from(body, 'base64url').toString()); } catch { return null; }
}

/** Lo que el cliente puede ver de su propio pedido (sin datos de otros ni internos). */
export function publicView(o) {
  return {
    folio: o.folio,
    status: o.status,
    createdAt: o.createdAt,
    lines: o.lines.map((l) => ({ name: l.name, size: l.size, quantity: l.quantity, total: l.total, customization: l.customization })),
    subtotal: o.subtotal,
    shipping: o.shipping ? { carrier: o.shipping.carrier, service: o.shipping.service, total: o.shipping.total, days: o.shipping.days } : null,
    total: o.total,
    tracking: o.label && o.label.trackingNumber ? { number: o.label.trackingNumber, url: o.label.trackingUrl || '' } : null,
    allInStock: o.allInStock,
  };
}
