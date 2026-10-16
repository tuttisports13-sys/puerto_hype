// Público: cualquier cliente puede dejar su reseña desde la web, pero NO se publica sola:
// queda en data/reviews_pending.json hasta que el admin la apruebe (y confirme si es compra real).
import { requirePost, updateJson, uploadImage } from './_github.js';

const text = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
const MAX_PENDING = 100; // evita que alguien llene la lista con spam

export default async function handler(req, res) {
  const body = requirePost(req, res);
  if (!body) return;

  try {
    // Campo trampa: los humanos no lo ven; los bots de spam suelen llenarlo
    if (body.website) return res.status(200).json({ success: true });

    const name = text(body.name, 40);
    const opinion = String(body.text ?? '').trim().slice(0, 600);
    const product = text(body.product, 120);
    const stars = Math.round(Number(body.stars));
    if (name.length < 2 || opinion.length < 5) return res.status(400).json({ error: 'Escribe tu nombre y tu opinión' });
    if (!(stars >= 1 && stars <= 5)) return res.status(400).json({ error: 'Elige de 1 a 5 estrellas' });

    let image = '';
    if (body.imageBase64) image = await uploadImage(body.imageBase64, 'reviews');

    const review = { id: Date.now(), name, stars, text: opinion, image, product, date: new Date().toISOString().slice(0, 10) };
    await updateJson('data/reviews_pending.json', (list) => {
      if (list.length >= MAX_PENDING) throw Object.assign(new Error('Hay muchas reseñas por revisar. Intenta más tarde.'), { status: 429 });
      return [review, ...list];
    }, `Reseña por aprobar de ${name}`);

    return res.status(200).json({ success: true, pending: true });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ error: error.message });
  }
}
