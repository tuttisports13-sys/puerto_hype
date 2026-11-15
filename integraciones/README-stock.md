# Stock conectado: Panel de Jerseys ↔ hoja STOCK ↔ puertohype.mx

```
 Panel de Jerseys ──(Google Sheets)──►  hoja STOCK  ◄──(Apps Script)── puertohype.mx
   · se trae las ventas WEB               · Movimientos: todas las ventas     · pregunta el stock
   · escribe su stock en StockWeb          · StockWeb: stock del panel         · anota cada venta pagada
```

- **Vendes en la web** → al pagarse, la página anota la venta en *Movimientos* con la nota `WEB PH-…`. La web descuenta esa talla al instante. Cuando abres el panel, la venta entra sola al panel y a tus totales (se ve en "Este mes · web").
- **Vendes en persona o por WhatsApp** (registras en el panel como siempre) → el panel actualiza la pestaña *StockWeb* y en ~30 s la web ya no ofrece esa talla.
- **Llega mercancía** (entrada en el panel) → la talla vuelve a aparecer en la web sola.
- Qué producto de la web es qué modelo del panel: `data/stock_links.json`, o en el **admin → editar producto → "Modelo en el Panel de Jerseys"**.

## Instalar (una sola vez, ~5 minutos)

1. Abre tu hoja **STOCK** → menú **Extensiones → Apps Script**.
2. Borra lo que haya y pega todo el contenido de `integraciones/stock-sync.gs`. Guarda (💾).
3. Arriba elige la función **configurar** y dale **▶ Ejecutar**. Google te pide permiso para tu hoja: acepta.
   Abajo, en el registro, sale **tu llave**. Cópiala.
4. **Implementar → Nueva implementación** → tipo **Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
   Copia la **URL** que termina en `/exec`.
5. En Vercel (Settings → Environment Variables) agrega:
   - `STOCK_SYNC_URL` = la URL `/exec`
   - `STOCK_SYNC_KEY` = la llave del paso 3
6. Abre el **Panel de Jerseys** una vez (dale permiso a Google Sheets si te lo pide). Arriba debe decir *"Tienda en línea al día"*.

> La URL es pública, pero sin la llave no responde nada. No pongas la llave en el código ni en el repo (es público).

## Cuidados
- No edites la pestaña **StockWeb** a mano: la llena el panel.
- No borres filas viejas de **Movimientos**; si necesitas corregir algo, registra una devolución o entrada.
- Las ventas de la web no se pueden borrar desde el panel (volverían a entrar). Si se cancela un pedido, registra una **devolución**.
- Si el script no responde, la web sigue vendiendo con las tallas de su catálogo (no se cae la tienda) y el pedido queda marcado en el admin con **REINTENTAR** para pasar la venta al panel.
