// Panel de admin: pedidos pagados en línea (lista, generar guía, marcar enviado).
import { isValidSession } from './_session.js';
import { requirePost } from './_github.js';
import { listOrders, updateOrder } from './_orders.js';
import { makeLabel, refreshLabel, applyPayment } from './_fulfill.js';

export default async function handler(req, res) {
  const body = requirePost(req, res);
  if (!body) return;
  if (!isValidSession(body.token)) return res.status(401).json({ error: 'Tu sesión expiró. Vuelve a entrar.' });

  try {
    const { action, folio } = body;
    if (action === 'list') {
      const orders = await listOrders();
      return res.status(200).json({ success: true, orders: orders.slice(0, 300) });
    }
    if (!folio) return res.status(400).json({ error: 'Falta el folio' });
    const find = async () => (await listOrders()).find((o) => o.folio === folio);

    let order;
    if (action === 'label') {
      // Para pedidos sobre pedido (cuando ya llegó la mercancía) o para reintentar una guía con error
      const current = await find();
      if (!current) return res.status(404).json({ error: 'Pedido no encontrado' });
      if (!['pagado', 'guia_lista'].includes(current.status)) return res.status(400).json({ error: 'El pedido todavía no está pagado' });
      order = await makeLabel(folio, { force: Boolean(body.force) });
    } else if (action === 'refresh') {
      order = await find();
      if (order && order.payment && order.payment.id && order.status === 'pendiente_pago') {
        await applyPayment(order.payment.id).catch(() => null);
        order = await find();
      }
      order = await refreshLabel(order);
    } else if (action === 'shipped' || action === 'cancel') {
      ({ order } = await updateOrder(folio, (o) => {
        o.status = action === 'shipped' ? 'enviado' : 'cancelado';
        if (action === 'shipped') o.shippedAt = new Date().toISOString();
      }, `Pedido ${folio}: ${action === 'shipped' ? 'enviado' : 'cancelado'}`));
    } else {
      return res.status(400).json({ error: 'Acción no válida' });
    }
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ error: error.message });
  }
}
