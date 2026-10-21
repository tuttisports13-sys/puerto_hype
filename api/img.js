// Proxy de fotos de Yupoo para el catálogo de pre-orden.
// Yupoo solo entrega la imagen si la petición trae su propio Referer, así que el
// navegador del cliente no puede pedirla directo. Uso: /api/img?p=<tienda>/<id>/<archivo>
// Solo acepta rutas de photo.yupoo.com con esa forma (no es un proxy abierto).

const PATH_RE = /^[A-Za-z0-9_-]+\/[A-Za-z0-9]+\/[A-Za-z0-9_-]+\.(jpe?g|png|webp|gif)$/;

export default async function handler(req, res) {
  const p = String(req.query.p || '');
  if (!PATH_RE.test(p)) return res.status(400).send('Ruta inválida');

  try {
    const upstream = await fetch(`https://photo.yupoo.com/${p}`, {
      headers: { Referer: 'https://x.yupoo.com/', 'User-Agent': 'Mozilla/5.0' },
    });
    const type = upstream.headers.get('content-type') || '';
    if (!upstream.ok || !type.startsWith('image/')) {
      res.setHeader('Cache-Control', 'public, s-maxage=600');
      return res.status(502).send('Imagen no disponible');
    }

    const body = Buffer.from(await upstream.arrayBuffer());
    res.setHeader('Content-Type', type);
    // Vercel la guarda en su CDN un año: cada foto se descarga de Yupoo una sola vez.
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
    return res.status(200).send(body);
  } catch {
    return res.status(502).send('Imagen no disponible');
  }
}
