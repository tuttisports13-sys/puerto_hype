// Conexión con la hoja STOCK (Google Apps Script) que comparte stock con el Panel de Jerseys.
// Variables en Vercel: STOCK_SYNC_URL (la URL /exec del script) y STOCK_SYNC_KEY (la llave que da configurar()).
import { readJson } from './_github.js';

const TALLAS = ['S', 'M', 'L', 'XL'];
const CACHE_MS = 30 * 1000;
let cache = { at: 0, data: null };
let linksCache = { at: 0, data: null };

export const enabled = () => Boolean(process.env.STOCK_SYNC_URL && process.env.STOCK_SYNC_KEY);

/** { idDeLaWeb: "EQUIPO - MODELO" } — qué producto de la web es qué modelo del panel. */
export async function getLinks({ fresh = false } = {}) {
  if (!fresh && linksCache.data && Date.now() - linksCache.at < CACHE_MS) return linksCache.data;
  const { data } = await readJson('data/stock_links.json', {});
  linksCache = { at: Date.now(), data: data && typeof data === 'object' ? data : {} };
  return linksCache.data;
}

/** Stock por modelo y talla desde la hoja. Devuelve null si no está configurado o no responde. */
export async function getStock({ fresh = false } = {}) {
  if (!enabled()) return null;
  if (!fresh && cache.data && Date.now() - cache.at < CACHE_MS) return cache.data;
  try {
    const url = `${process.env.STOCK_SYNC_URL}?key=${encodeURIComponent(process.env.STOCK_SYNC_KEY)}`;
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(8000) });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'respuesta inválida');
    // Sin foto del panel todavía: no sabemos el stock, mejor no bloquear ventas
    if (!data.listo) return null;
    cache = { at: Date.now(), data: data.stock || {} };
    return cache.data;
  } catch (err) {
    console.error('stock-sync get', err.message);
    return cache.data; // última foto buena, si hay
  }
}

/** Tallas disponibles de un modelo, en orden. */
export function availableSizes(stockRow) {
  return TALLAS.filter((t) => (stockRow?.[t] || 0) > 0);
}

/** Avisa a la hoja una venta pagada. No duplica (el script revisa el folio). */
export async function reportSale(order) {
  if (!enabled()) return { skipped: 'sin configurar' };
  const links = await getLinks({ fresh: true });
  const lineas = order.lines
    .filter((l) => l.inStock && links[l.id] && TALLAS.includes(l.size))
    .map((l) => ({ producto: links[l.id], talla: l.size, cantidad: l.quantity, precio: l.unit }));
  if (!lineas.length) return { skipped: 'sin productos del panel' };
  const res = await fetch(process.env.STOCK_SYNC_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ key: process.env.STOCK_SYNC_KEY, action: 'venta', folio: order.folio, cliente: order.address?.nombre?.split(' ')[0] || '', lineas }),
    signal: AbortSignal.timeout(15000),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.ok) throw new Error(`La hoja no aceptó la venta: ${data.error || res.status}`);
  cache = { at: 0, data: cache.data }; // que la siguiente consulta traiga el stock nuevo
  return { ok: true, filas: data.filas || 0, duplicado: Boolean(data.duplicado) };
}

/** Para la tienda: { idDeLaWeb: { S, M, L, XL } } solo de los productos ligados al panel. */
export async function stockForWeb() {
  const [links, stock] = await Promise.all([getLinks(), getStock()]);
  if (!stock) return null;
  const out = {};
  for (const [id, key] of Object.entries(links)) {
    if (stock[key]) out[id] = stock[key];
  }
  return out;
}
