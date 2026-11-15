/**
 * Puente de stock: Panel de Jerseys  <->  hoja "STOCK"  <->  puertohype.mx
 *
 * Se pega en la hoja STOCK: Extensiones → Apps Script. Ver integraciones/README-stock.md.
 *
 * - La página pregunta el stock (GET) y avisa cada venta pagada en línea (POST).
 * - El Panel de Jerseys escribe su stock en la pestaña "StockWeb" cada vez que algo cambia,
 *   y se trae las ventas de la web (filas de Movimientos cuya nota empieza con "WEB ").
 * - Mientras el panel no se abra, este script resta del stock las ventas web que el panel
 *   todavía no ha leído, para que la página nunca venda algo que ya no hay.
 *
 * La llave secreta vive en las propiedades del script (no en este archivo).
 */

const HOJA_MOV = 'Movimientos';
const HOJA_STOCK = 'StockWeb';
const PRIMERA_FILA_MOV = 5; // filas 1-4 son título, instrucciones y encabezados
const TALLAS = ['S', 'M', 'L', 'XL'];

/** Córrelo UNA vez desde el editor (botón ▶ Ejecutar). Crea la pestaña y te muestra tu llave. */
function configurar() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(HOJA_STOCK);
  if (!sh) {
    sh = ss.insertSheet(HOJA_STOCK);
    sh.getRange(1, 1, 1, 7).setValues([['Producto', 'S', 'M', 'L', 'XL', 'Actualizado', 'Filas leídas']]);
    sh.getRange(1, 1, 1, 7).setFontWeight('bold');
    sh.getRange(1, 9).setValue('No edites esta pestaña: la llena el Panel de Jerseys solo.');
  }
  const props = PropertiesService.getScriptProperties();
  let key = props.getProperty('KEY');
  if (!key) {
    key = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    props.setProperty('KEY', key);
  }
  Logger.log('Listo. Copia esta llave en Vercel como STOCK_SYNC_KEY:\n' + key);
}

function doGet(e) {
  if (!llaveOk(e && e.parameter && e.parameter.key)) return json({ ok: false, error: 'llave' });
  return json(leerStock());
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json({ ok: false, error: 'json' }); }
  if (!llaveOk(body.key)) return json({ ok: false, error: 'llave' });
  if (body.action === 'venta') return json(registrarVenta(body));
  return json({ ok: false, error: 'accion' });
}

function llaveOk(k) {
  const key = PropertiesService.getScriptProperties().getProperty('KEY');
  return Boolean(key) && k === key;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

const norm = (s) => String(s || '').trim().toUpperCase();

/** Stock = foto que dejó el panel − ventas web que el panel todavía no ha leído. */
function leerStock() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(HOJA_STOCK);
  if (!sh) return { ok: true, listo: false, stock: {} };
  const data = sh.getDataRange().getValues();
  const actualizado = data[1] ? data[1][5] : '';
  const filasLeidas = Number(data[1] ? data[1][6] : 0) || 0;
  const stock = {};
  for (let r = 1; r < data.length; r++) {
    const nombre = norm(data[r][0]);
    if (!nombre) continue;
    stock[nombre] = { S: Number(data[r][1]) || 0, M: Number(data[r][2]) || 0, L: Number(data[r][3]) || 0, XL: Number(data[r][4]) || 0 };
  }

  const mov = ss.getSheetByName(HOJA_MOV);
  const ultima = mov.getLastRow();
  const desde = Math.max(filasLeidas + 1, PRIMERA_FILA_MOV);
  if (ultima >= desde) {
    const filas = mov.getRange(desde, 1, ultima - desde + 1, 8).getValues();
    filas.forEach((f) => {
      if (!String(f[7]).startsWith('WEB ') || !/venta/i.test(String(f[3]))) return;
      const p = stock[norm(f[1])];
      const t = norm(f[2]);
      if (p && t in p) p[t] = Math.max(0, p[t] - (Number(f[4]) || 0));
    });
  }
  return { ok: true, listo: Object.keys(stock).length > 0, actualizado: actualizado ? String(actualizado) : '', stock: stock };
}

/** Anota una venta pagada en la web. No duplica: si el folio ya está, no hace nada. */
function registrarVenta(b) {
  const folio = String(b.folio || '').replace(/[^\w-]/g, '');
  const lineas = Array.isArray(b.lineas) ? b.lineas : [];
  if (!folio || !lineas.length) return { ok: false, error: 'datos' };

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const mov = SpreadsheetApp.getActive().getSheetByName(HOJA_MOV);
    const ya = mov.getRange('H:H').createTextFinder('WEB ' + folio).matchEntireCell(false).findNext();
    if (ya) return { ok: true, duplicado: true };

    const hoy = Utilities.formatDate(new Date(), 'America/Mexico_City', 'dd/MM/yyyy');
    const nota = ('WEB ' + folio + (b.cliente ? ' · ' + String(b.cliente).slice(0, 40) : '')).trim();
    const filas = lineas
      .filter((l) => l && l.producto && TALLAS.includes(norm(l.talla)) && Number(l.cantidad) > 0)
      .map((l) => {
        const precio = Number(l.precio) || 0;
        const cant = Math.floor(Number(l.cantidad));
        return [hoy, norm(l.producto), norm(l.talla), 'Venta', cant, precio, precio * cant, nota];
      });
    if (!filas.length) return { ok: false, error: 'sin lineas' };
    const inicio = Math.max(mov.getLastRow() + 1, PRIMERA_FILA_MOV);
    mov.getRange(inicio, 1, filas.length, 8).setValues(filas);
    return { ok: true, filas: filas.length };
  } finally {
    lock.releaseLock();
  }
}
