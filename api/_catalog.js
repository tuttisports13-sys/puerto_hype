// Catálogo y precios del lado del servidor, para cobrar exactamente lo que dice la tienda.
// Nunca se confía en el precio que manda el navegador: aquí se recalcula todo.
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { readJson } from './_github.js';
import { getLinks, getStock } from './_stocksync.js';

const NAME_PRICE = 50;   // nombre y número en la playera
const PATCH_PRICE = 30;  // por parche, máximo 3
const VERSION_PRICES = { Fan: 600, Jugador: 650 };
// Categorías donde la tienda no ofrece personalizado (igual que openQuickView en js/app.js)
const NO_CUSTOM = new Set(['nba', 'balones', 'f1', 'sudaderas', 'conjunto-entrenamiento']);

let sportsCache = null;

/** Jerseys "sobre pedido": viven dentro de js/app.js (SPORTS_PRODUCTS). */
function loadSports() {
  if (sportsCache) return sportsCache;
  const src = fs.readFileSync(path.join(process.cwd(), 'js', 'app.js'), 'utf8');
  const start = src.indexOf('const SPORTS_PRODUCTS = ');
  const end = src.indexOf('\nlet STOCK_PRODUCTS');
  if (start < 0 || end < 0) throw new Error('No se encontró el catálogo de jerseys');
  const literal = src.slice(start + 'const SPORTS_PRODUCTS = '.length, end).trim().replace(/;\s*$/, '');
  const list = vm.runInNewContext(`(${literal})`, {}, { timeout: 2000 });
  sportsCache = new Map(list.filter((p) => !p.isFolder).map((p) => [p.id, p]));
  return sportsCache;
}

/** Ofertas con fecha límite, igual que promoActive() en la tienda (hora del centro de México). */
function promoPrice(p) {
  const pr = p.promo;
  if (!pr || !pr.price || !pr.until) return null;
  const end = new Date(`${pr.until}T23:59:59-06:00`).getTime();
  return Date.now() <= end && pr.price < p.price ? pr.price : null;
}

const text = (v, max) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);
const fail = (msg) => Object.assign(new Error(msg), { status: 400 });

/**
 * Recibe las líneas del carrito [{ id, size, quantity, version, customization }]
 * y devuelve las líneas con precio real, o lanza un error que se le puede mostrar al cliente.
 */
export async function priceCart(lines) {
  if (!Array.isArray(lines) || lines.length === 0) throw fail('Tu carrito está vacío');
  if (lines.length > 40) throw fail('Son demasiados productos para un solo pedido');

  const { data: stockList } = await readJson('data/stock_products.json', []);
  const stock = new Map(stockList.map((p) => [p.id, p]));
  const sports = loadSports();
  // Productos ligados al Panel de Jerseys: las tallas válidas son las del stock en vivo, no las del catálogo
  const [links, live] = await Promise.all([getLinks(), getStock()]);
  const liveRow = (id) => (live && links[id] && live[links[id]]) || null;

  const out = [];
  for (const raw of lines) {
    const id = text(raw && raw.id, 80);
    if (id.startsWith('po-')) throw fail('Los productos "por cotizar" se piden por WhatsApp');
    const fromStock = stock.get(id);
    const product = fromStock || sports.get(id);
    if (!product) throw fail('Uno de tus productos ya no existe. Quítalo del carrito e intenta de nuevo.');
    if (product.hidden || (product.soldOut && !liveRow(id))) throw fail(`"${product.name}" ya está agotado`);

    const quantity = Math.floor(Number(raw.quantity));
    if (!(quantity >= 1 && quantity <= 50)) throw fail('Cantidad no válida');

    const row = fromStock ? liveRow(id) : null;
    const sizes = row ? ['S', 'M', 'L', 'XL'] : (Array.isArray(product.sizes) ? product.sizes : []);
    const size = text(raw.size, 40) || 'Unitalla';
    if (sizes.length && !sizes.includes(size)) throw fail(`La talla ${size} de "${product.name}" ya no está disponible`);

    let unit = fromStock ? (promoPrice(product) ?? product.price) : product.price;
    let name = product.name;
    let version = '';
    if (product.hasVersionSelector) {
      version = raw.version === 'Jugador' ? 'Jugador' : 'Fan';
      unit = VERSION_PRICES[version];
      name += ` (Versión ${version})`;
    }

    const canCustomize = product.customizable && !NO_CUSTOM.has(product.category) && product.section !== 'preorder';
    const c = raw.customization || {};
    const customization = {};
    let extra = 0;
    if (canCustomize && c.name) {
      customization.name = text(c.name, 40);
      extra += NAME_PRICE;
    }
    if (canCustomize && c.patches) {
      const n = Math.floor(Number(c.patches));
      if (n >= 1 && n <= 3) { customization.patches = n; extra += PATCH_PRICE * n; }
    }

    unit = Math.round(Number(unit) || 0) + extra;
    if (unit <= 0) throw fail(`"${product.name}" no tiene precio; pídelo por WhatsApp`);

    // Paquetes de mayoreo: "Paquete 10 Jerseys" pesa como 10 piezas
    const porPaquete = id.startsWith('lote-') ? (Number((product.name.match(/(\d+)\s*(jerseys?|playeras?|gorras?|pzas?|piezas?)/i) || [])[1]) || 1) : 1;
    out.push({
      id,
      name,
      size,
      units: quantity * porPaquete,
      mayoreo: id.startsWith('lote-') || product.category === 'mayoreo',
      quantity,
      version,
      customization: Object.keys(customization).length ? customization : null,
      unit,
      total: unit * quantity,
      image: product.image || '',
      // Stock = está en mano y sale hoy. Sobre pedido = la guía se hace cuando llegue.
      inStock: Boolean(fromStock),
    });
  }

  // Stock real del Panel de Jerseys (a través de la hoja STOCK): no vender lo que ya no hay
  const linked = out.filter((l) => l.inStock);
  if (linked.length) {
    const stock = live;
    if (stock) {
      const want = {};
      for (const l of linked) {
        const k = links[l.id];
        if (!k || !stock[k]) continue;
        const key = `${l.id}|${l.size}`;
        want[key] = (want[key] || 0) + l.quantity;
        const have = Number(stock[k][l.size]) || 0;
        if (want[key] > have) {
          throw fail(have > 0
            ? `Solo nos quedan ${have} de "${l.name}" en talla ${l.size}`
            : `"${l.name}" en talla ${l.size} se acaba de agotar`);
        }
      }
    }
  }

  const pieces = out.reduce((s, l) => s + l.quantity, 0);
  if (pieces > 100) throw fail('Para más de 100 piezas escríbenos por WhatsApp');
  const subtotal = out.reduce((s, l) => s + l.total, 0);
  const units = out.reduce((s, l) => s + (l.units || l.quantity), 0);
  return { lines: out, pieces, units, subtotal, allInStock: out.every((l) => l.inStock), mayoreo: out.some((l) => l.mayoreo) };
}

/** Texto corto de una línea para Mercado Pago, la guía y el admin. */
export function lineLabel(l) {
  const bits = [`${l.name}`, `Talla ${l.size}`];
  if (l.customization?.name) bits.push(`Nombre: ${l.customization.name}`);
  if (l.customization?.patches) bits.push(`${l.customization.patches} parche(s)`);
  return bits.join(' · ');
}
