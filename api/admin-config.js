// Panel de admin: textos editables de la página (barra de anuncios y portada) en data/site_config.json.
import { isValidSession } from './_session.js';
import { readJson, requirePost, updateJson } from './_github.js';

const text = (v, max) => String(v ?? '').trim().slice(0, max);

export default async function handler(req, res) {
  const body = requirePost(req, res);
  if (!body) return;
  if (!isValidSession(body.token)) return res.status(401).json({ error: 'Tu sesión expiró. Vuelve a entrar.' });

  try {
    if (body.action === 'get') {
      const { data } = await readJson('data/site_config.json', {});
      return res.status(200).json({ success: true, config: data });
    }
    const c = body.config || {};
    const config = {
      ticker: (Array.isArray(c.ticker) ? c.ticker : []).map((t) => text(t, 120)).filter(Boolean).slice(0, 8),
      heroBadge: text(c.heroBadge, 80),
      heroTitle: text(c.heroTitle, 120),
      heroSubtitle: text(c.heroSubtitle, 260),
    };
    if (config.ticker.length === 0 || !config.heroTitle) return res.status(400).json({ error: 'Faltan textos obligatorios' });
    await updateJson('data/site_config.json', () => config, 'Admin: actualizar textos de la página', {});
    return res.status(200).json({ success: true, config });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
