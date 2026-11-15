# Pago con tarjeta + guía automática

Cómo funciona: el cliente arma su carrito → **PAGAR CON TARJETA** → pone su dirección → Skydropx le cotiza el envío → paga en Mercado Pago (tarjeta, débito, OXXO, SPEI) → Mercado Pago avisa a la página → se marca pagado y, si todo es de **stock**, se genera la guía en Skydropx. El pedido aparece en **Admin → PEDIDOS** con la guía en PDF para imprimir.

- Productos **sobre pedido**: se cobran igual, pero la guía la generas tú desde el admin (botón GENERAR GUÍA) cuando ya tengas todo.
- Productos **por cotizar** (`po-`): siguen yendo por WhatsApp.
- Los precios se recalculan en el servidor (ofertas, versión Fan/Jugador, nombre +$50, parches +$30). Nadie puede pagar menos editando la página.
- Los pedidos se guardan **cifrados** en `data/orders.enc.json` (el repo es público). Sin `ORDERS_KEY` nadie puede leerlos.

## Variables para poner en Vercel

Vercel → tu proyecto → Settings → Environment Variables.

| Variable | Qué es | De dónde sale |
|---|---|---|
| `MP_ACCESS_TOKEN` | Llave privada de Mercado Pago. Empieza con `TEST-` (pruebas) o `APP_USR-` (real) | mercadopago.com.mx/developers → Tus integraciones → Credenciales |
| `MP_WEBHOOK_SECRET` | Firma de los avisos (recomendado) | Tus integraciones → Webhooks. URL: `https://puertohype.mx/api/mp-webhook`, evento **Pagos** |
| `SKYDROPX_CLIENT_ID` / `SKYDROPX_CLIENT_SECRET` | Llaves de la API | pro.skydropx.com → Configuración → API |
| `ORDERS_KEY` | Llave para cifrar pedidos (30+ letras y números al azar). **No la pierdas ni la cambies**: sin ella no se pueden leer los pedidos viejos | Invéntala o genérala con un administrador de contraseñas |
| `SHIP_FROM_NOMBRE` | Quién envía (máx. 30 letras) | |
| `SHIP_FROM_TEL` | Teléfono a 10 números | |
| `SHIP_FROM_EMAIL` | Correo | |
| `SHIP_FROM_CALLE` | Calle y número (máx. 45) | |
| `SHIP_FROM_COLONIA` / `SHIP_FROM_MUNICIPIO` / `SHIP_FROM_ESTADO` / `SHIP_FROM_CP` | Dirección de origen | |

Opcionales:

| Variable | Default | Para qué |
|---|---|---|
| `SHIP_FROM_REFERENCIA` | Puerto Hype | Referencia de tu domicilio |
| `SHIP_KG_POR_PIEZA` | 0.4 | Peso por prenda para cotizar (tenis: súbelo) |
| `SKYDROPX_CARTA_PORTE` | 53102400 | Clave SAT del contenido (revísala en Skydropx para ropa) |
| `SKYDROPX_TIPO_EMPAQUE` | 4G | Tipo de empaque (4G = caja de cartón) |
| `SKYDROPX_FORMATO` | standard | `thermal` si imprimes en impresora térmica |
| `AUTO_GUIA` | 1 | `0` = nunca hacer la guía sola |
| `STOCK_AUTO_DESCUENTO` | (apagado) | `1` = al pagar, quita la talla vendida del stock y marca agotado si ya no hay tallas |
| `SITE_URL` | el dominio de la visita | Forzar `https://puertohype.mx` |

## Probar sin cobrar

1. Pon `MP_ACCESS_TOKEN` con la llave **de prueba** (`TEST-…`) y paga con las tarjetas de prueba de Mercado Pago.
2. En la vista previa de Vercel, desactiva **Deployment Protection** de las vistas previas (o usa el dominio real). Si no, Mercado Pago no puede mandar el aviso. Aunque el aviso no llegue, al regresar de Mercado Pago la página revisa el pago sola.
3. Skydropx cobra cada guía real: haz la primera prueba con `AUTO_GUIA=0` y genera la guía a mano desde el admin.
