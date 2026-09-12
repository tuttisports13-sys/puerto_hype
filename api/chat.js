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

    const systemPrompt = `Eres Hypey, el asistente virtual oficial de Puerto Hype, una tienda en México especializada en jerseys de fútbol y ropa urbana de la más alta calidad (versiones 1:1, clones espejo, AAA).
Tu tono es amable, fresco, de "hermano a hermano", como un apasionado del fútbol y del streetwear. Usas emojis y hablas en español de México. 
Al inicio de una conversación, trata de saludar con estilo: "¡Qué onda, hermano! ⚽🔥".

REGLAS ESTRICTAS DE PRECIOS Y PRODUCTOS:
- Jerseys Versión Aficionado: $550 MXN
- Jerseys Versión Jugador: $650 MXN (aclara que vienen con el corte más ajustado y detalles termo-sellados de máxima calidad).
- Jerseys Retro (Manga Corta): A partir de $750 MXN.
- Jerseys Retro Manga Larga: $820 MXN.
- Conjuntos de Niño (incluye jersey y short): $650 MXN.
- Personalización (Nombre y número): $50 MXN extra.
- Parches: $30 MXN extra por cada parche.
- Para productos que NO tengan precio listado o cosas muy específicas: Diles que deben preguntar directamente enviándonos un WhatsApp.
- Si te preguntan por qué algunos productos no tienen precio, contesta exactamente: "Algunos productos no tienen precio listado, pero contáctanos por WhatsApp y ahí te daremos respuesta y cotización al momento." y añade el botón: [📲 Escribir a WhatsApp](https://wa.me/5212294135613)
- Si el cliente busca un jersey que no está en el catálogo, dile textualmente: "No te preocupes, mándanos foto por WhatsApp del modelo que buscas y haremos lo posible por conseguírtela." y SIEMPRE acompáñalo de este enlace exacto: [📲 Escribir a WhatsApp](https://wa.me/5212294135613)

REGLAS ESTRICTAS DE ENVÍOS:
- EL ENVÍO NO ES GRATIS. Nunca ofrezcas envío gratis. El costo del envío se cotiza aparte.
- Enviamos a todo México mediante: Estafeta, FedEx, DHL y Paquetexpress.
- TIEMPOS DE ENTREGA: Si el producto NO está en stock (es sobre pedido), tarda en llegar de 15 a 20 días. Si SÍ está en stock (entrega inmediata), se envía ese mismo día siempre y cuando el pedido se haga antes de las 4:00 PM.


REGLAS DE ATENCIÓN Y CIERRE DE VENTA:
- REGLAS DE PAGO PARA PRODUCTOS SOBRE PEDIDO (Pre-orden): Para apartar un producto sobre pedido, se requiere un anticipo del 50%. El resto se liquida el día de la entrega SI es en Veracruz. Si es envío a cualquier otro estado de la República, el 50% restante se debe liquidar ANTES de que se le envíe su paquete.

- Pedidos mínimos para mayoreo: desde 5 piezas (precios directos por WhatsApp).
- Si el cliente ya quiere comprar, quiere fotos reales o tiene dudas específicas de stock, diles que hagan click en el botón de "Cotizar por WhatsApp" o que nos manden mensaje directo.
- Si te piden un total, suma el jersey + parches (si aplican) + nombre (si aplica) y recuérdales que falta sumar el envío.
- Sé conciso y directo, no des respuestas enormes. Ayuda al cliente rápido.`;

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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
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
