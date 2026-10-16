// Panel de admin: sube UNA foto (ya comprimida en el navegador) y devuelve su URL.
// Se sube de una en una para no pasar el límite de tamaño de Vercel.
import { isValidSession } from './_session.js';
import { requirePost, uploadImage } from './_github.js';

export default async function handler(req, res) {
  const body = requirePost(req, res);
  if (!body) return;
  if (!isValidSession(body.token)) return res.status(401).json({ error: 'Tu sesión expiró. Vuelve a entrar.' });
  if (!body.imageBase64) return res.status(400).json({ error: 'Falta la imagen' });

  try {
    const url = await uploadImage(body.imageBase64, 'stock');
    return res.status(200).json({ success: true, url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
