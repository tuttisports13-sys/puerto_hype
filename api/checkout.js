// Pago en línea de la tienda:
//   POST { action: 'quote' }  → valida el carrito y cotiza el envío con Skydropx
//   POST { action: 'pay' }    → guarda el pedido y regresa el link de pago de Mercado Pago
//   POST { action: 'status' } → el cliente consulta su pedido (folio + token secreto)
//   /api/mp-webhook           → aviso de Mercado Pago (vercel.json lo manda aquí con ?webhook=mp)
import crypto from 'crypto';
import { priceCart } from './_catalog.js';
import { addOrder, getOrder, newAccessToken, newFolio, publicView, sign, verify } from './_orders.js';
import { quote } from './_skydropx.js';
import { createPreference, validSignature } from './_mercadopago.js';
import { applyPayment, refreshLabel } from './_fulfill.js';
import { stockForWeb } from './_stocksync.js';

const QUOTE_TTL_MS = 45 * 60 * 1000;
const ESTADOS = ['Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'];

const text = (v, max) => String(v ?? '').replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
const bad = (msg) => Object.assign(new Error(msg), { status: 400 });

function cleanArea(a = {}) {
  const out = { cp: text(a.cp, 5), estado: text(a.estado, 40), municipio: text(a.municipio, 60), colonia: text(a.colonia, 80) };
  if (!/^\d{5}$/.test(out.cp)) throw bad('Escribe un código postal de 5 números');
  if (!ESTADOS.includes(out.estado)) throw bad('Elige tu estado');
  if (out.municipio.length < 2) throw bad('Escribe tu municipio o ciudad');
  if (out.colonia.length < 2) throw bad('Escribe tu colonia');
  return out;
}

function cleanAddress(a = {}) {
  const out = {
    ...cleanArea(a),
    nombre: text(a.nombre, 60),
    telefono: String(a.telefono ?? '').replace(/\D/g, '').replace(/^52(?=\d{10}$)/, ''),
    email: text(a.email, 80).toLowerCase(),
    calle: text(a.calle, 80),
    referencias: text(a.referencias, 120),
  };
  if (out.nombre.length < 3) throw bad('Escribe tu nombre completo');
  if (!/^\d{10}$/.test(out.telefono)) throw bad('Escribe tu teléfono a 10 números');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(out.email)) throw bad('Escribe un correo válido');
  if (out.calle.length < 4 || !/\d/.test(out.calle)) throw bad('Escribe tu calle y número');
  return out;
}

const areaHash = (a) => crypto.createHash('sha256').update([a.cp, a.estado, a.municipio, a.colonia].join('|').toLowerCase()).digest('base64url').slice(0, 22);

function siteUrl(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `https://${host}`;
}

const checkoutOn = (body) => process.env.CHECKOUT_ACTIVO === '1' || body.prueba === true;
const closed = () => bad('El pago en línea todavía no está disponible. Haz tu pedido por WhatsApp.');

async function handleQuote(body) {
  if (!checkoutOn(body)) throw closed();
  const area = cleanArea(body.address);
  const cart = await priceCart(body.items);
  const q = await quote(area, cart.pieces);
  if (!q.rates.length) throw bad('No encontramos paqueterías para ese código postal. Revisa tus datos o pídelo por WhatsApp.');
  const token = sign({ qid: q.quotationId, rates: q.rates, area: areaHash(area), pieces: cart.pieces, exp: Date.now() + QUOTE_TTL_MS });
  return {
    subtotal: cart.subtotal,
    pieces: cart.pieces,
    allInStock: cart.allInStock,
    lines: cart.lines.map((l) => ({ id: l.id, name: l.name, size: l.size, quantity: l.quantity, unit: l.unit, total: l.total })),
    rates: q.rates.map(({ id, carrier, service, total, days }) => ({ id, carrier, service, total, days })),
    quoteToken: token,
  };
}

// Entrega personal en Veracruz / Boca del Río: sin envío, solo nombre y WhatsApp para quedar
function cleanContact(a = {}) {
  const out = {
    nombre: text(a.nombre, 60),
    telefono: String(a.telefono ?? '').replace(/\D/g, '').replace(/^52(?=\d{10}$)/, ''),
    email: text(a.email, 80).toLowerCase(),
    entrega: 'personal',
  };
  if (out.nombre.length < 3) throw bad('Escribe tu nombre completo');
  if (!/^\d{10}$/.test(out.telefono)) throw bad('Escribe tu WhatsApp a 10 números');
  if (out.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(out.email)) throw bad('Escribe un correo válido');
  return out;
}

async function handlePayPersonal(body, req) {
  const address = cleanContact(body.address);
  const cart = await priceCart(body.items);
  const order = {
    folio: newFolio(),
    accessToken: newAccessToken(),
    createdAt: new Date().toISOString(),
    status: 'pendiente_pago',
    lines: cart.lines,
    pieces: cart.pieces,
    allInStock: cart.allInStock,
    subtotal: cart.subtotal,
    shipping: { personal: true, carrier: 'Entrega personal', provider: 'personal', service: 'Veracruz / Boca del Río', total: 0, days: null },
    total: cart.subtotal,
    address,
    payment: null,
    label: null,
  };
  await addOrder(order);
  const pref = await createPreference(order, siteUrl(req));
  return { folio: order.folio, url: pref.url };
}

async function handlePay(body, req) {
  if (!checkoutOn(body)) throw closed();
  if (body.entrega === 'personal') return handlePayPersonal(body, req);
  const address = cleanAddress(body.address);
  const q = verify(body.quoteToken);
  if (!q || q.exp < Date.now()) throw bad('La cotización del envío venció. Vuelve a cotizar.');
  if (q.area !== areaHash(address)) throw bad('Cambiaste la dirección. Vuelve a cotizar el envío.');
  const rate = q.rates.find((r) => r.id === body.rateId);
  if (!rate) throw bad('Elige una paquetería');

  const cart = await priceCart(body.items);
  if (cart.pieces !== q.pieces) throw bad('Cambiaste el carrito. Vuelve a cotizar el envío.');

  const order = {
    folio: newFolio(),
    accessToken: newAccessToken(),
    createdAt: new Date().toISOString(),
    status: 'pendiente_pago',
    lines: cart.lines,
    pieces: cart.pieces,
    allInStock: cart.allInStock,
    subtotal: cart.subtotal,
    shipping: { quotationId: q.qid, rateId: rate.id, carrier: rate.carrier, provider: rate.provider, service: rate.service, total: rate.total, days: rate.days },
    total: cart.subtotal + rate.total,
    address,
    payment: null,
    label: null,
  };
  await addOrder(order);
  const pref = await createPreference(order, siteUrl(req));
  return { folio: order.folio, url: pref.url };
}

async function handleStatus(body) {
  const folio = text(body.folio, 40);
  const t = String(body.t || '');
  let order = await getOrder(folio);
  if (!order || t.length !== order.accessToken.length || !crypto.timingSafeEqual(Buffer.from(t), Buffer.from(order.accessToken))) {
    throw Object.assign(new Error('No encontramos ese pedido'), { status: 404 });
  }
  // Al regresar de Mercado Pago llega el payment_id: lo revisamos por si el aviso aún no llega
  if (body.paymentId && /^\d{5,20}$/.test(String(body.paymentId)) && order.status === 'pendiente_pago') {
    const r = await applyPayment(String(body.paymentId)).catch((err) => { console.error(err); return null; });
    if (r && r.folio === folio) order = await getOrder(folio);
  }
  order = await refreshLabel(order).catch(() => order);
  return publicView(order);
}

async function handleWebhook(req, res) {
  const q = req.query || {};
  const b = req.body || {};
  const type = q.type || q.topic || b.type || b.topic;
  const id = q['data.id'] || (b.data && b.data.id) || q.id;
  if (type !== 'payment' || !id) return res.status(200).json({ ok: true, ignored: true });
  if (!validSignature(req, String(id))) return res.status(401).json({ error: 'firma inválida' });
  try {
    const r = await applyPayment(String(id));
    return res.status(200).json({ ok: true, ...r });
  } catch (err) {
    console.error('webhook', err);
    // 500 → Mercado Pago vuelve a intentar más tarde
    return res.status(500).json({ error: 'no procesado' });
  }
}

export default async function handler(req, res) {
  if (req.query && req.query.webhook === 'mp') return handleWebhook(req, res);
  if (req.query && req.query.stock) {
    // Stock en vivo del Panel de Jerseys para la tienda: { idDeLaWeb: { S, M, L, XL } }
    const stock = await stockForWeb().catch(() => null);
    if (typeof res.setHeader === 'function') res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=60');
    return res.status(200).json({ success: true, stock, checkout: process.env.CHECKOUT_ACTIVO === '1' });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const body = req.body || {};
  try {
    let out;
    if (body.action === 'quote') out = await handleQuote(body);
    else if (body.action === 'pay') out = await handlePay(body, req);
    else if (body.action === 'status') out = await handleStatus(body);
    else return res.status(400).json({ error: 'Acción no válida' });
    return res.status(200).json({ success: true, ...out });
  } catch (err) {
    const status = err.status && err.status < 500 && err.status !== 401 ? err.status : 500;
    if (status === 500) console.error('checkout', body.action, err);
    const msg = status === 500 ? 'Tuvimos un problema para procesar tu pedido. Intenta de nuevo o escríbenos por WhatsApp.' : err.message;
    return res.status(status).json({ success: false, error: msg });
  }
}
