// Panel de admin: leer y guardar el conocimiento de Hypey (data/hype_config.json).
import { isValidSession } from './_session.js';
import { readJson, requirePost, updateJson } from './_github.js';

const FILE = 'data/hype_config.json';

export default async function handler(req, res) {
  const body = requirePost(req, res);
  if (!body) return;
  if (!isValidSession(body.token)) return res.status(401).json({ error: 'Tu sesión expiró. Vuelve a entrar.' });

  try {
    if (body.action === 'get') {
      const { data } = await readJson(FILE, {});
      return res.status(200).json({ success: true, instructions: data.instructions || '' });
    }
    if (body.action === 'save') {
      const instructions = String(body.instructions ?? '').trim().slice(0, 12000);
      if (instructions.length < 50) return res.status(400).json({ error: 'Las instrucciones están muy cortas' });
      await updateJson(FILE, (cfg) => ({ ...cfg, instructions }), 'Admin: entrenar a Hypey', {});
      return res.status(200).json({ success: true });
    }
    return res.status(400).json({ error: 'Acción no válida' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
