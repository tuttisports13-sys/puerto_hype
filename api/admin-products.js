// Panel de admin: crear, editar y eliminar productos de data/stock_products.json.
import { isValidSession } from './_session.js';
import { readJson, requirePost, updateJson } from './_github.js';

const FILE = 'data/stock_products.json';

const text = (v, max = 400) => String(v ?? '').trim().slice(0, max);
const isImageUrl = (u) => /^(https:\/\/|images\/)[^\s"'<>]+$/.test(String(u));

/** Toma solo los campos que el admin puede editar y los limpia. */
function sanitize(input = {}) {
  const out = {};
  if ('name' in input) out.name = text(input.name, 120);
  if ('price' in input) out.price = Math.max(0, Math.round(Number(input.price) || 0));
  if ('sizes' in input) {
    const list = Array.isArray(input.sizes) ? input.sizes : String(input.sizes).split(',');
    out.sizes = [...new Set(list.map((s) => text(s, 40)).filter(Boolean))].slice(0, 30);
  }
  if ('description' in input) out.description = text(input.description, 600);
  if ('badge' in input) out.badge = text(input.badge, 30).toUpperCase();
  if ('category' in input) out.category = input.category === 'mayoreo' ? 'mayoreo' : 'sneakers';
  if ('soldOut' in input) out.soldOut = Boolean(input.soldOut);
  if ('hidden' in input) out.hidden = Boolean(input.hidden);
  if ('gallery' in input) {
    out.gallery = (Array.isArray(input.gallery) ? input.gallery : []).filter(isImageUrl).slice(0, 12);
    out.image = out.gallery[0] || '';
  }
  return out;
}

export default async function handler(req, res) {
  const body = requirePost(req, res);
  if (!body) return;
  if (!isValidSession(body.token)) return res.status(401).json({ error: 'Tu sesión expiró. Vuelve a entrar.' });

  try {
    const { action, id } = body;
    const fields = sanitize(body.product);
    let saved = null;

    if (action === 'list') {
      // Lectura directa de GitHub: siempre la versión más reciente (sin esperar al deploy)
      const { data } = await readJson(FILE, []);
      return res.status(200).json({ success: true, products: data });
    }

    if (action === 'create') {
      if (!fields.name || !fields.price) return res.status(400).json({ error: 'Falta nombre o precio' });
      if (!fields.gallery || fields.gallery.length === 0) return res.status(400).json({ error: 'Agrega al menos una foto' });
      saved = {
        id: `stock-${Date.now()}`,
        name: fields.name,
        category: fields.category || 'sneakers',
        price: fields.price,
        retailPrice: Math.round(fields.price * 1.5),
        badge: fields.badge ?? 'NUEVO',
        badgeType: 'badge-hot',
        image: fields.image,
        gallery: fields.gallery,
        sizes: fields.sizes || [],
        ...(fields.description ? { description: fields.description } : {}),
        soldOut: Boolean(fields.soldOut),
        hidden: Boolean(fields.hidden),
      };
      await updateJson(FILE, (list) => [saved, ...list], `Admin: agregar ${saved.name}`);
    } else if (action === 'update') {
      if (!id) return res.status(400).json({ error: 'Falta el producto' });
      await updateJson(FILE, (list) => {
        const p = list.find((x) => x.id === id);
        if (!p) throw Object.assign(new Error('Producto no encontrado'), { status: 404 });
        if (fields.gallery && fields.gallery.length === 0) throw Object.assign(new Error('El producto necesita al menos una foto'), { status: 400 });
        Object.assign(p, fields);
        if (fields.price) p.retailPrice = Math.round(fields.price * 1.5);
        saved = p;
        return list;
      }, `Admin: editar ${fields.name || id}`);
    } else if (action === 'delete') {
      if (!id) return res.status(400).json({ error: 'Falta el producto' });
      await updateJson(FILE, (list) => {
        const next = list.filter((x) => x.id !== id);
        if (next.length === list.length) throw Object.assign(new Error('Producto no encontrado'), { status: 404 });
        return next;
      }, `Admin: eliminar ${id}`);
    } else {
      return res.status(400).json({ error: 'Acción no válida' });
    }

    return res.status(200).json({ success: true, product: saved });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ error: error.message });
  }
}
