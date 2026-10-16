// Utilidades para leer/escribir archivos del repo en GitHub (lo usa el panel de admin).
// Los archivos de /api que empiezan con "_" no se publican como rutas.
import { githubToken } from './_session.js';

export const OWNER = 'tuttisports13-sys';
export const REPO = 'puerto_hype';
export const BRANCH = 'main';
const API = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

const headers = () => ({
  Authorization: `Bearer ${githubToken()}`,
  'Content-Type': 'application/json',
  Accept: 'application/vnd.github+json',
});

/** Lee un JSON del repo. Devuelve { data, sha } (data = fallback si no existe). */
export async function readJson(path, fallback = []) {
  const res = await fetch(`${API}/${path}?ref=${BRANCH}`, { headers: headers(), cache: 'no-store' });
  if (res.status === 404) return { data: fallback, sha: undefined };
  if (!res.ok) throw new Error(`No se pudo leer ${path} (${res.status})`);
  const file = await res.json();
  return { data: JSON.parse(Buffer.from(file.content, 'base64').toString('utf8')), sha: file.sha };
}

async function putFile(path, contentBase64, message, sha) {
  return fetch(`${API}/${path}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ message, content: contentBase64, branch: BRANCH, ...(sha ? { sha } : {}) }),
  });
}

/**
 * Lee el JSON, aplica `mutate(data)` y lo guarda. Si alguien más lo cambió entre medio
 * (conflicto de sha), vuelve a leer y reintenta una vez para no pisar cambios.
 */
export async function updateJson(path, mutate, message, fallback = []) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const { data, sha } = await readJson(path, fallback);
    const result = await mutate(data);
    const next = result === undefined ? data : result;
    const res = await putFile(path, Buffer.from(JSON.stringify(next, null, 2)).toString('base64'), message, sha);
    if (res.ok) return next;
    if (res.status !== 409 && res.status !== 422) throw new Error(`No se pudo guardar ${path} (${res.status})`);
  }
  throw new Error('El archivo cambió mientras guardabas. Intenta de nuevo.');
}

/** Sube una imagen (dataURL o base64 JPEG) y devuelve su URL pública. */
export async function uploadImage(base64, folder = 'stock') {
  const clean = String(base64).replace(/^data:image\/\w+;base64,/, '');
  if (clean.length > 3_000_000) throw new Error('La imagen es demasiado grande');
  const name = `${folder}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.jpg`;
  const path = `images/${folder}/${name}`;
  const res = await putFile(path, clean, `Admin: subir imagen ${name}`);
  if (!res.ok) throw new Error(`No se pudo subir la imagen (${res.status})`);
  return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`;
}

/** Solo acepta POST: devuelve el body, o responde 405 y null. */
export function requirePost(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return null;
  }
  return req.body || {};
}
