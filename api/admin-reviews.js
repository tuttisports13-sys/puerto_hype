// Panel de admin: reseñas por aprobar (aprobar / rechazar) y eliminar reseñas publicadas.
import { isValidSession } from './_session.js';
import { deleteRawFile, readJson, requirePost, updateJson } from './_github.js';

const PENDING = 'data/reviews_pending.json';
const PUBLISHED = 'data/reviews.json';
const notFound = () => Object.assign(new Error('Reseña no encontrada'), { status: 404 });

export default async function handler(req, res) {
  const body = requirePost(req, res);
  if (!body) return;
  if (!isValidSession(body.token)) return res.status(401).json({ error: 'Tu sesión expiró. Vuelve a entrar.' });

  try {
    const id = String(body.id ?? '');

    if (body.action === 'pending') {
      const { data } = await readJson(PENDING, []);
      return res.status(200).json({ success: true, reviews: data });
    }

    if (body.action === 'approve') {
      let review;
      await updateJson(PENDING, (list) => {
        review = list.find((r) => String(r.id) === id);
        if (!review) throw notFound();
        return list.filter((r) => String(r.id) !== id);
      }, `Admin: aprobar reseña de ${id}`);
      // Sello "Compra verificada" solo si el admin confirma que es su cliente
      review.verified = Boolean(body.verified);
      if (body.product !== undefined) review.product = String(body.product).trim().slice(0, 120);
      await updateJson(PUBLISHED, (list) => [review, ...list], `Admin: publicar reseña de ${review.name}`);
      return res.status(200).json({ success: true, review });
    }

    if (body.action === 'reject' || body.action === 'delete') {
      const file = body.action === 'reject' ? PENDING : PUBLISHED;
      let removed;
      await updateJson(file, (list) => {
        removed = list.find((r) => String(r.id) === id);
        if (!removed) throw notFound();
        return list.filter((r) => String(r.id) !== id);
      }, `Admin: ${body.action === 'reject' ? 'rechazar' : 'eliminar'} reseña ${id}`);
      // La foto de una reseña rechazada también se borra del repo
      if (body.action === 'reject' && removed.image) await deleteRawFile(removed.image);
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Acción no válida' });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ error: error.message });
  }
}
