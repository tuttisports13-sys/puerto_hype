import { githubToken } from './_session.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, stars, text, imageBase64 } = req.body;
    
    if (!name || !stars || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const token = githubToken();
    const owner = 'tuttisports13-sys';
    const repo = 'puerto_hype';
    const branch = 'main';

    let imageUrl = "";

    // 1. Upload image if provided
    if (imageBase64) {
      const imgName = `review_${Date.now()}.jpg`;
      const imgPath = `images/reviews/${imgName}`;
      
      // Clean base64 string
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const imgPutResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${imgPath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add review image ${imgName}`,
          content: base64Data,
          branch: branch
        })
      });

      if (!imgPutResponse.ok) {
        throw new Error('Failed to upload image to GitHub');
      }
      
      // The raw URL for the image
      imageUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${imgPath}`;
    }

    // 2. Fetch current reviews.json
    const getReviewsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/data/reviews.json`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!getReviewsResponse.ok) {
      throw new Error('Failed to fetch reviews.json');
    }

    const reviewsData = await getReviewsResponse.json();
    const currentSha = reviewsData.sha;
    
    // Decode base64 content from GitHub
    const decodedContent = Buffer.from(reviewsData.content, 'base64').toString('utf8');
    let reviewsList = [];
    try {
      reviewsList = JSON.parse(decodedContent);
    } catch(e) {
      reviewsList = [];
    }

    // 3. Append new review
    const newReview = {
      id: Date.now(),
      name,
      stars: parseInt(stars),
      text,
      image: imageUrl,
      date: new Date().toISOString().split('T')[0]
    };

    reviewsList.unshift(newReview); // Add to beginning

    const updatedContentBase64 = Buffer.from(JSON.stringify(reviewsList, null, 2)).toString('base64');

    // 4. Update reviews.json
    const putReviewsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/data/reviews.json`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add new review from ${name}`,
        content: updatedContentBase64,
        sha: currentSha,
        branch: branch
      })
    });

    if (!putReviewsResponse.ok) {
      throw new Error('Failed to update reviews.json');
    }

    return res.status(200).json({ success: true, review: newReview });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
