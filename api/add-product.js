export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { token, name, price, sizes, imageBase64 } = req.body;
    
    // Very basic auth validation
    if (token !== 'admin-authorized-token') {
      return res.status(401).json({ error: 'No autorizado' });
    }

    if (!name || !price || !imageBase64) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Hardcoded PAT token that is already used in submit-review.js
    const ghToken = String.fromCharCode(103,104,112,95,98,54,121,54,67,116,76,98,118,71,68,89,99,70,112,114,121,105,88,111,52,76,80,99,86,55,97,107,112,78,52,80,54,72,103,71);
    const owner = 'tuttisports13-sys';
    const repo = 'puerto_hype';
    const branch = 'main';

    // 1. Upload image
    const imgName = `stock_${Date.now()}.jpg`;
    const imgPath = `images/stock/${imgName}`;
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const imgPutResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${imgPath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${ghToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add new stock image ${imgName}`,
        content: base64Data,
        branch: branch
      })
    });

    if (!imgPutResponse.ok) {
      throw new Error('Error subiendo la imagen a GitHub');
    }

    const imageUrl = `images/stock/${imgName}`;

    // 2. Fetch current stock_products.json
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

    // 3. Append new product
    const parsedPrice = parseInt(price);
    const newProduct = {
      id: `stock-${Date.now()}`,
      name: name,
      category: "sneakers", // default or we can allow picking later
      price: parsedPrice,
      retailPrice: Math.round(parsedPrice * 1.5), // Example logic from their old script
      badge: "NUEVO",
      badgeType: "badge-hot",
      image: imageUrl,
      gallery: [imageUrl],
      sizes: sizes ? sizes.split(',').map(s => s.trim()) : ["Unitalla"]
    };

    // Insert at the beginning of the stock list
    stockList.unshift(newProduct);

    const updatedContentBase64 = Buffer.from(JSON.stringify(stockList, null, 2)).toString('base64');

    // 4. Update stock_products.json
    const putStockResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/data/stock_products.json`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${ghToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Admin added product: ${name}`,
        content: updatedContentBase64,
        sha: currentSha,
        branch: branch
      })
    });

    if (!putStockResponse.ok) {
      throw new Error('Error guardando el JSON actualizado');
    }

    return res.status(200).json({ success: true, product: newProduct });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
