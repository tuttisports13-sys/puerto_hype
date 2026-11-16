// Skydropx PRO (https://pro.skydropx.com/es-MX/api-docs): cotizar envíos y generar guías.
// Variables en Vercel: SKYDROPX_CLIENT_ID, SKYDROPX_CLIENT_SECRET y los datos de origen SHIP_FROM_*.

const BASE = () => (process.env.SKYDROPX_BASE_URL || 'https://api-pro.skydropx.com').replace(/\/$/, '');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const cut = (v, max) => String(v ?? '').trim().slice(0, max);

let tokenCache = { value: null, exp: 0 };

async function token() {
  if (tokenCache.value && Date.now() < tokenCache.exp) return tokenCache.value;
  const { SKYDROPX_CLIENT_ID: id, SKYDROPX_CLIENT_SECRET: secret } = process.env;
  if (!id || !secret) throw new Error('Faltan SKYDROPX_CLIENT_ID y SKYDROPX_CLIENT_SECRET en Vercel');
  const res = await fetch(`${BASE()}/api/v1/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: id, client_secret: secret, grant_type: 'client_credentials' }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) throw new Error(`Skydropx no aceptó las llaves (${res.status})`);
  tokenCache = { value: data.access_token, exp: Date.now() + Math.max(60, (data.expires_in || 3600) - 120) * 1000 };
  return tokenCache.value;
}

async function sky(method, path, body) {
  const res = await fetch(`${BASE()}${path}`, {
    method,
    headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = typeof data.errors === 'string' ? data.errors : JSON.stringify(data.errors || data.error || data.message || '');
    throw Object.assign(new Error(`Skydropx ${res.status}: ${detail.slice(0, 300)}`), { status: res.status, skydropx: data });
  }
  return data;
}

/** Dirección de origen (desde donde mandas). */
export function origin() {
  const e = process.env;
  const need = ['SHIP_FROM_CP', 'SHIP_FROM_ESTADO', 'SHIP_FROM_MUNICIPIO', 'SHIP_FROM_COLONIA', 'SHIP_FROM_CALLE', 'SHIP_FROM_NOMBRE', 'SHIP_FROM_TEL', 'SHIP_FROM_EMAIL'];
  const missing = need.filter((k) => !e[k]);
  if (missing.length) throw new Error(`Faltan datos de origen en Vercel: ${missing.join(', ')}`);
  return {
    postal_code: e.SHIP_FROM_CP, area_level1: e.SHIP_FROM_ESTADO, area_level2: e.SHIP_FROM_MUNICIPIO, area_level3: e.SHIP_FROM_COLONIA,
    street1: cut(e.SHIP_FROM_CALLE, 45), name: cut(e.SHIP_FROM_NOMBRE, 30), company: cut(e.SHIP_FROM_EMPRESA || 'Puerto Hype', 60),
    phone: e.SHIP_FROM_TEL, email: e.SHIP_FROM_EMAIL, reference: cut(e.SHIP_FROM_REFERENCIA || 'Puerto Hype', 30),
  };
}

/** Caja según piezas. Por defecto 0.4 kg por prenda (configurable con SHIP_KG_POR_PIEZA). */
export function parcelFor(pieces) {
  const kg = Number(process.env.SHIP_KG_POR_PIEZA) || 0.4;
  const weight = Math.max(1, Math.ceil(pieces * kg * 10) / 10);
  const height = Math.min(60, 8 + Math.ceil(pieces / 2) * 4);
  return { length: 35, width: 28, height, weight };
}

const area = (a) => ({ country_code: 'MX', postal_code: a.cp, area_level1: a.estado, area_level2: a.municipio, area_level3: a.colonia });

/** Cotiza y espera (máx ~9 s) a que lleguen las tarifas. Devuelve las mejores, de la más barata a la más cara. */
export async function quote(address, pieces) {
  const o = origin();
  const body = {
    quotation: {
      address_from: { country_code: 'MX', postal_code: o.postal_code, area_level1: o.area_level1, area_level2: o.area_level2, area_level3: o.area_level3 },
      address_to: area(address),
      parcels: [parcelFor(pieces)],
    },
  };
  let q = await sky('POST', '/api/v1/quotations', body);
  for (let i = 0; i < 9 && !q.is_completed; i++) {
    await sleep(1000);
    q = await sky('GET', `/api/v1/quotations/${q.id}`);
  }
  const rates = (q.rates || [])
    // Solo entrega a domicilio: las que dejan el paquete en una oficina (PuntoPost, ocurre…) piden
    // escoger sucursal, y la tienda todavía no tiene esa opción.
    .filter((r) => r.success && Number(r.total) > 0 && !r.office_delivery)
    .map((r) => ({
      id: r.id,
      carrier: r.provider_display_name || r.provider_name,
      provider: r.provider_name,
      serviceCode: r.provider_service_code,
      service: r.provider_service_name,
      total: Math.ceil(Number(r.total)),
      days: r.days ?? null,
    }))
    .sort((a, b) => a.total - b.total);
  // Una por paquetería (la más barata de cada una), máximo 5 opciones
  const seen = new Set();
  const best = rates.filter((r) => (seen.has(r.provider) ? false : seen.add(r.provider))).slice(0, 5);
  return { quotationId: q.id, rates: best, completed: Boolean(q.is_completed) };
}

function packageInfo(resp) {
  const attrs = resp?.data?.attributes || {};
  const pkg = (resp?.included || []).find((x) => x.type === 'package' && x.attributes)?.attributes || {};
  return {
    shipmentId: resp?.data?.id || attrs.id,
    status: attrs.workflow_status || '',
    carrier: attrs.carrier_name || '',
    trackingNumber: pkg.tracking_number ? String(pkg.tracking_number) : (attrs.master_tracking_number || ''),
    trackingUrl: pkg.tracking_url_provider || '',
    labelUrl: pkg.label_url || '',
    error: attrs.error_detail?.error_message || '',
  };
}

export async function getShipment(id) {
  return packageInfo(await sky('GET', `/api/v1/shipments/${id}`));
}

/** Genera la guía. Si la tarifa ya venció, vuelve a cotizar y usa la misma paquetería (o la más barata). */
export async function createLabel(order) {
  const o = origin();
  const a = order.address;
  const declared = Math.min(order.subtotal, 5000);
  const shipment = (rateId) => ({
    shipment: {
      rate_id: rateId,
      printing_format: process.env.SKYDROPX_FORMATO === 'thermal' ? 'thermal' : 'standard',
      address_from: { street1: o.street1, name: o.name, company: o.company, phone: o.phone, email: o.email, reference: o.reference },
      address_to: {
        street1: cut(a.calle, 45), name: cut(a.nombre, 30), company: cut(a.nombre, 60),
        phone: a.telefono, email: a.email, reference: cut(a.referencias || 'Sin referencias', 30),
      },
      packages: [{
        package_number: '1',
        package_protected: false,
        declared_value: declared,
        consignment_note: process.env.SKYDROPX_CARTA_PORTE || '53102400',
        package_type: process.env.SKYDROPX_TIPO_EMPAQUE || '4G',
      }],
    },
  });

  let rateId = order.shipping?.rateId;
  let resp;
  try {
    if (!rateId) throw Object.assign(new Error('sin tarifa'), { status: 422 });
    resp = await sky('POST', '/api/v1/shipments/', shipment(rateId));
  } catch (err) {
    if (err.status !== 422 || /cr[eé]dito|fondos/i.test(err.message)) throw err;
    const fresh = await quote(a, order.pieces);
    const same = fresh.rates.find((r) => r.provider === order.shipping?.provider) || fresh.rates[0];
    if (!same) throw new Error('Skydropx no regresó tarifas para esa dirección');
    rateId = same.id;
    resp = await sky('POST', '/api/v1/shipments/', shipment(rateId));
  }

  let info = packageInfo(resp);
  for (let i = 0; i < 6 && !info.labelUrl && info.status !== 'failed' && info.shipmentId; i++) {
    await sleep(1200);
    info = await getShipment(info.shipmentId);
  }
  return info;
}
