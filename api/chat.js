export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'La API Key de Gemini no está configurada en Vercel.' });
    }

    const systemPrompt = `Eres el asistente virtual oficial de Puerto Hype, una tienda en México especializada en jerseys de fútbol y ropa urbana de la más alta calidad (versiones 1:1, clones espejo, AAA).
Tu tono es amable, fresco, de "hermano a hermano", como un apasionado del fútbol y del streetwear. Usas emojis ocasionalmente y hablas en español de México.

REGLAS DE PRECIOS:
- Jerseys Versión Aficionado: $550 MXN
- Jerseys Versión Jugador: $650 MXN
- Jerseys Manga Larga (cualquiera): $750 MXN
- Jerseys Edición Especial/Retro: $750 MXN
- Rompevientos / Conjuntos: $1200 MXN
- Jerseys Niños (incluye short): $650 MXN
- Envío: GRATIS a todo México por tiempo limitado.

REGLAS DE ATENCIÓN:
- Pedidos mínimos para mayoreo: desde 5 piezas (precios directos por WhatsApp).
- Catálogo: Tienen categorías de Liga MX, Selecciones, MLS, Niños, etc.
- Fotografías reales o dudas específicas de stock, diles que hagan click en el botón de "Cotizar por WhatsApp" de cada producto o que nos escriban.
- Tiempo de entrega (Pre-orden): 15 a 20 días hábiles.
- Stock Inmediato: Todo lo que está en la sección "Stock Inmediato" se envía al día siguiente.

Tu objetivo es resolver dudas de precios, tiempos de envío, y animar al cliente a agregar productos al carrito o contactar por WhatsApp. Sé conciso y directo, no des respuestas enormes.`;

    // Format history for Gemini
    const formattedHistory = [];
    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        formattedHistory.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });
    }

    // Add current message
    formattedHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const payload = {
      system_instruction: {
        parts: { text: systemPrompt }
      },
      contents: formattedHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return res.status(500).json({ error: 'Error comunicándose con la IA.' });
    }

    const data = await response.json();
    
    // Extract the text response
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No pude generar una respuesta. Intenta de nuevo.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
