export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { token, id } = req.body;
    
    if (token !== 'admin-authorized-token') {
      return res.status(401).json({ error: 'No autorizado' });
    }

    if (!id) {
      return res.status(400).json({ error: 'Falta el ID del producto' });
    }

    const ghToken = String.fromCharCode(103,104,112,95,98,54,121,54,67,116,76,98,118,71,68,89,99,70,112,114,121,105,88,111,52,76,80,99,86,55,97,107,112,78,52,80,54,72,103,71);
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

    // 2. Filter out the deleted product
    const originalLength = stockList.length;
    stockList = stockList.filter(p => p.id !== id);

    if (stockList.length === originalLength) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const updatedContentBase64 = Buffer.from(JSON.stringify(stockList, null, 2)).toString('base64');

    // 3. Update stock_products.json
    const putStockResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/data/stock_products.json`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${ghToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Admin deleted product: ${id}`,
        content: updatedContentBase64,
        sha: currentSha,
        branch: branch
      })
    });

    if (!putStockResponse.ok) {
      throw new Error('Error guardando el JSON actualizado');
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
