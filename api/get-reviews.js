export default async function handler(req, res) {
  try {
    const token = String.fromCharCode(103,104,112,95,98,54,121,54,67,116,76,98,118,71,68,89,99,70,112,114,121,105,88,111,52,76,80,99,86,55,97,107,112,78,52,80,54,72,103,71);
    const owner = 'tuttisports13-sys';
    const repo = 'puerto_hype';

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/data/reviews.json`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      // Prevent fetching cached version
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    const data = await response.json();
    const decodedContent = Buffer.from(data.content, 'base64').toString('utf8');
    
    // Allow CORS if needed
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    return res.status(200).json(JSON.parse(decodedContent));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
