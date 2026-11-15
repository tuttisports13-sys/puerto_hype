// Lo que pasa cuando Mercado Pago confirma un pago: marcar pagado, descontar stock y hacer la guía.
import { getPayment } from './_mercadopago.js';
import { updateOrder } from './_orders.js';
import { createLabel, getShipment } from './_skydropx.js';
import { updateJson } from './_github.js';

const PAY_STATUS = {
  approved: 'pagado', pending: 'pendiente_pago', in_process: 'pendiente_pago', authorized: 'pendiente_pago',
  rejected: 'rechazado', cancelled: 'cancelado', refunded: 'reembolsado', charged_back: 'contracargo',
};

/** Consulta el pago directo a Mercado Pago (nunca se confía en lo que dice el aviso) y lo aplica. */
export async function applyPayment(paymentId) {
  const p = await getPayment(paymentId);
  const folio = p.external_reference;
  if (!folio) return { ignored: 'sin folio' };

  let becamePaid = false;
  const { order } = await updateOrder(folio, (o) => {
    becamePaid = false; // puede correr dos veces si hubo choque al guardar
    const next = PAY_STATUS[p.status] || o.status;
    const same = o.payment && o.payment.id === String(p.id) && o.payment.status === p.status;
    if (same) return false;
    // Un pago aprobado solo cuenta si es por el total correcto y en pesos
    if (p.status === 'approved' && (p.currency_id !== 'MXN' || Number(p.transaction_amount) + 0.01 < o.total)) {
      o.payment = { id: String(p.id), status: 'monto_incorrecto', amount: p.transaction_amount };
      o.status = 'revisar';
      return true;
    }
    o.payment = { id: String(p.id), status: p.status, method: p.payment_method_id || '', type: p.payment_type_id || '', amount: p.transaction_amount };
    if (next === 'pagado') {
      // Si ya estaba pagado (o más adelante), no se regresa el estado
      if (o.status === 'pendiente_pago' || o.status === 'rechazado' || o.status === 'cancelado') {
        o.status = 'pagado';
        o.paidAt = new Date().toISOString();
        becamePaid = true;
      }
    } else if (o.status === 'pendiente_pago' || o.status === 'rechazado') {
      o.status = next;
    } else if (next === 'reembolsado' || next === 'contracargo') {
      o.status = next;
    }
    return true;
  }, `Pedido ${folio}: pago ${p.status}`);

  if (becamePaid && order) await afterPaid(order);
  return { folio, status: order ? order.status : null };
}

async function afterPaid(order) {
  if (process.env.STOCK_AUTO_DESCUENTO === '1' && order.lines.some((l) => l.inStock)) {
    await discountStock(order).catch((err) => console.error('stock', order.folio, err));
  }
  if (order.allInStock && process.env.AUTO_GUIA !== '0') {
    await makeLabel(order.folio).catch((err) => console.error('guia', order.folio, err));
  }
}

/** Quita la talla vendida del producto; si ya no le quedan tallas, lo marca agotado. */
async function discountStock(order) {
  await updateJson('data/stock_products.json', (list) => {
    for (const l of order.lines.filter((x) => x.inStock)) {
      const p = list.find((x) => x.id === l.id);
      if (!p || !Array.isArray(p.sizes)) continue;
      p.sizes = p.sizes.filter((s) => s !== l.size);
      if (p.sizes.length === 0) p.soldOut = true;
    }
    return list;
  }, `Venta en línea ${order.folio}: descontar stock`);
}

/** Genera la guía una sola vez (aunque lleguen dos avisos juntos). */
export async function makeLabel(folio, { force = false } = {}) {
  const claim = await updateOrder(folio, (o) => {
    if (!['pagado', 'guia_lista'].includes(o.status) && !force) return false;
    if (o.label && (o.label.state === 'generando' || o.label.state === 'lista') && !force) return false;
    o.label = { state: 'generando', at: new Date().toISOString() };
    return true;
  }, `Pedido ${folio}: generando guía`);
  if (!claim.changed) return claim.order;

  let info;
  try {
    info = await createLabel(claim.order);
  } catch (err) {
    const { order } = await updateOrder(folio, (o) => { o.label = { state: 'error', error: err.message.slice(0, 300), at: new Date().toISOString() }; }, `Pedido ${folio}: error en guía`);
    return order;
  }
  const { order } = await updateOrder(folio, (o) => {
    o.label = labelFrom(info);
    if (o.label.state === 'lista' && o.status === 'pagado') o.status = 'guia_lista';
  }, `Pedido ${folio}: guía ${info.trackingNumber || 'en proceso'}`);
  return order;
}

function labelFrom(info) {
  const state = info.labelUrl ? 'lista' : (info.status === 'failed' ? 'error' : 'generando');
  return {
    state, shipmentId: info.shipmentId, carrier: info.carrier, trackingNumber: info.trackingNumber,
    trackingUrl: info.trackingUrl, labelUrl: info.labelUrl, error: info.error, at: new Date().toISOString(),
  };
}

/** Si la guía se quedó "generando", pregunta a Skydropx si ya está. */
export async function refreshLabel(order) {
  if (!order || !order.label || order.label.state !== 'generando' || !order.label.shipmentId) return order;
  const info = await getShipment(order.label.shipmentId);
  if (!info.labelUrl && info.status !== 'failed') return order;
  const { order: saved } = await updateOrder(order.folio, (o) => {
    if (!o.label || o.label.shipmentId !== info.shipmentId || o.label.state === 'lista') return false;
    o.label = labelFrom(info);
    if (o.label.state === 'lista' && o.status === 'pagado') o.status = 'guia_lista';
  }, `Pedido ${order.folio}: guía lista`);
  return saved || order;
}
