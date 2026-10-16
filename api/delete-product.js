import { isValidSession, githubToken } from './_session.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { token, id, action, size, newSize } = req.body;
    
    if (!isValidSession(token)) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    if (!id) {
      return res.status(400).json({ error: 'Falta el ID del producto' });
    }

    const ghToken = githubToken();
    const owner = 'tuttisports13-sys';
    const repo = 'puerto_hype';
    const branch = 'main';

    // 1. Fetch current stock_products.json
    const getStockResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/data/stock_products.json`, {
      headers: { 'Authorization': `Bearer ${ghToken}` }
    });

    if (!getStockResponse.ok) {
      throw new Error('Error descargando stock_products.json');
    }

    const stockData = await getStockResponse.json();
    const currentSha = stockData.sha;
    
    const decodedContent = Buffer.from(stockData.content, 'base64').toString('utf8');
    let stockList = [];
    try {
      stockList = JSON.parse(decodedContent);
    } catch(e) {
      stockList = [];
    }

    let commitMessage = '';

    if (action === 'remove_size') {
      const prod = stockList.find(p => p.id === id);
      if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });
      prod.sizes = (prod.sizes || []).filter(s => s !== size);
      commitMessage = `Admin removed size ${size} from ${prod.name}`;
    } else if (action === 'add_size') {
      const prod = stockList.find(p => p.id === id);
      if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });
      if (!prod.sizes) prod.sizes = [];
      if (!prod.sizes.includes(newSize)) prod.sizes.push(newSize);
      commitMessage = `Admin added size ${newSize} to ${prod.name}`;
    } else {
      // Delete whole product
      const originalLength = stockList.length;
      stockList = stockList.filter(p => p.id !== id);
      if (stockList.length === originalLength) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      commitMessage = `Admin deleted product: ${id}`;
    }

    const updatedContentBase64 = Buffer.from(JSON.stringify(stockList, null, 2)).toString('base64');

    // 2. Update stock_products.json on GitHub
    const putStockResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/data/stock_products.json`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${ghToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: commitMessage,
        content: updatedContentBase64,
        sha: currentSha,
        branch: branch
      })
    });

    if (!putStockResponse.ok) {
      throw new Error('Error guardando en GitHub');
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
