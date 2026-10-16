// Panel de admin: eliminar reseñas de data/reviews.json.
import { isValidSession } from './_session.js';
import { requirePost, updateJson } from './_github.js';

export default async function handler(req, res) {
  const body = requirePost(req, res);
  if (!body) return;
  if (!isValidSession(body.token)) return res.status(401).json({ error: 'Tu sesión expiró. Vuelve a entrar.' });

  try {
    if (body.action !== 'delete' || body.id === undefined) return res.status(400).json({ error: 'Acción no válida' });
    await updateJson('data/reviews.json', (list) => {
      const next = list.filter((r) => String(r.id) !== String(body.id));
      if (next.length === list.length) throw Object.assign(new Error('Reseña no encontrada'), { status: 404 });
      return next;
    }, `Admin: eliminar reseña ${body.id}`);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ error: error.message });
  }
}
