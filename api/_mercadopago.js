// Mercado Pago Checkout Pro: el cliente paga en la página segura de Mercado Pago
// (tarjeta, débito, OXXO, SPEI, Mercado Crédito) y Mercado Pago nos avisa al webhook.
// Variables en Vercel: MP_ACCESS_TOKEN y (recomendado) MP_WEBHOOK_SECRET.
import crypto from 'crypto';
import { lineLabel } from './_catalog.js';

const API = 'https://api.mercadopago.com';

function accessToken() {
  const t = process.env.MP_ACCESS_TOKEN;
  if (!t) throw new Error('Falta MP_ACCESS_TOKEN en Vercel');
  return t;
}

async function mp(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json',
      ...(method === 'POST' ? { 'X-Idempotency-Key': crypto.randomUUID() } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(`Mercado Pago ${res.status}: ${data.message || ''}`.trim()), { status: res.status });
  return data;
}

/** Crea la preferencia de pago y regresa el link al que mandamos al cliente. */
export async function createPreference(order, siteUrl) {
  const items = order.lines.map((l) => ({
    id: l.id,
    title: lineLabel(l).slice(0, 250),
    quantity: l.quantity,
    unit_price: l.unit,
    currency_id: 'MXN',
    ...(l.image && /^https:\/\//.test(l.image) ? { picture_url: l.image } : {}),
  }));
  if (order.shipping.total > 0) items.push({
    id: 'envio',
    title: `Envío ${order.shipping.carrier} ${order.shipping.service || ''}`.trim().slice(0, 250),
    quantity: 1,
    unit_price: order.shipping.total,
    currency_id: 'MXN',
  });

  const back = (estado) => `${siteUrl}/?pedido=${encodeURIComponent(order.folio)}&t=${order.accessToken}&pago=${estado}`;
  const pref = await mp('POST', '/checkout/preferences', {
    items,
    // Sin datos del comprador: Mercado Pago los pide en su página. Mandar un correo real choca con
    // las cuentas de prueba ("Uy, algo salió mal") y no hace falta para cobrar.
    external_reference: order.folio,
    notification_url: `${siteUrl}/api/mp-webhook`,
    back_urls: { success: back('ok'), pending: back('pendiente'), failure: back('error') },
    auto_return: 'approved',
    statement_descriptor: 'PUERTOHYPE',
    metadata: { folio: order.folio },
  });
  const sandbox = String(accessToken()).startsWith('TEST-');
  return { id: pref.id, url: sandbox ? (pref.sandbox_init_point || pref.init_point) : pref.init_point };
}

export const getPayment = (id) => mp('GET', `/v1/payments/${encodeURIComponent(id)}`);

/**
 * Revisa la firma x-signature del aviso de Mercado Pago.
 * Si no hay MP_WEBHOOK_SECRET se acepta (igual siempre consultamos el pago directo a Mercado Pago).
 */
export function validSignature(req, dataId) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true;
  const sig = String(req.headers['x-signature'] || '');
  const requestId = String(req.headers['x-request-id'] || '');
  const parts = Object.fromEntries(sig.split(',').map((p) => p.split('=').map((s) => s.trim())));
  if (!parts.ts || !parts.v1) return false;
  const id = /^[a-z0-9]+$/i.test(dataId) ? String(dataId).toLowerCase() : dataId;
  const manifest = `id:${id};request-id:${requestId};ts:${parts.ts};`;
  const expected = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
  return expected.length === parts.v1.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
}
