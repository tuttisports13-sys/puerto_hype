// Pago en línea (Mercado Pago) + envío con guía automática (Skydropx).
// Usa el carrito de app.js (AppState.cart) y habla con /api/checkout.
(() => {
  const ESTADOS = ['Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'];
  const FORM_KEY = 'ph_checkout_datos';
  const LAST_KEY = 'ph_ultimo_pedido';

  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const money = (n) => `$${Number(n || 0).toLocaleString('es-MX')}`;
  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } },
  };

  const state = { quote: null, rateId: null, areaKey: '' };

  // Modo prueba: el botón de pago solo se ve con el link secreto ?probar=1 (o cuando CHECKOUT_ACTIVO=1 en Vercel).
  // ?probar=0 lo vuelve a esconder en este navegador.
  const TEST_KEY = 'ph_probar_pago';
  const testMode = () => store.get(TEST_KEY) === 1;
  (() => {
    const p = new URLSearchParams(location.search).get('probar');
    if (p === '1') store.set(TEST_KEY, 1);
    if (p === '0') { try { localStorage.removeItem(TEST_KEY); } catch (e) { /* nada */ } }
  })();
  let checkoutActivo = false;

  async function api(payload) {
    const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) throw new Error(data.error || 'No pudimos conectar. Intenta de nuevo.');
    return data;
  }

  const app = () => (typeof AppState !== "undefined" ? AppState : null);
  const cart = () => (app() ? app().cart : []);
  const cartLines = () => cart().map((i) => ({
    id: i.id,
    size: i.size,
    quantity: i.quantity,
    version: /\(Versión Jugador\)/.test(i.name) ? 'Jugador' : /\(Versión Fan\)/.test(i.name) ? 'Fan' : '',
    customization: i.customization || null,
  }));
  const hasQuoteItems = () => cart().some((i) => String(i.id).startsWith('po-'));

  // ---------- modal ----------
  function ensureModal() {
    if ($('#ck-modal')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div id="ck-overlay" class="ck-overlay" hidden></div>
      <section id="ck-modal" class="ck-modal" role="dialog" aria-modal="true" aria-labelledby="ck-title" hidden>
        <header class="ck-head">
          <div>
            <span class="ck-tag">🔒 PAGO SEGURO</span>
            <h2 id="ck-title" class="ck-title">FINALIZAR COMPRA</h2>
          </div>
          <button type="button" class="ck-close" data-ck-close aria-label="Cerrar">&times;</button>
        </header>
        <div id="ck-body" class="ck-body"></div>
      </section>`;
    document.body.append(...wrap.children);
    $('#ck-overlay').addEventListener('click', close);
    $('#ck-modal').addEventListener('click', (e) => { if (e.target.closest('[data-ck-close]')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#ck-modal').hidden) close(); });
  }
  function open(html) {
    ensureModal();
    $('#ck-body').innerHTML = html;
    $('#ck-overlay').hidden = false;
    $('#ck-modal').hidden = false;
    document.body.style.overflow = 'hidden';
    $('#ck-body').scrollTop = 0;
  }
  function close() {
    if (!$('#ck-modal')) return;
    $('#ck-overlay').hidden = true;
    $('#ck-modal').hidden = true;
    document.body.style.overflow = '';
    clearTimeout(pollTimer);
  }

  // ---------- formulario ----------
  function field(name, label, attrs = '', value = '') {
    return `<label class="ck-field"><span>${label}</span><input name="${name}" value="${esc(value)}" ${attrs}></label>`;
  }

  function openCheckout() {
    if (typeof toggleCart === 'function') toggleCart(false);
    if (!cart().length) return;
    if (hasQuoteItems()) {
      open(`<p class="ck-note">Tu carrito tiene productos <b>por cotizar</b>. Esos se piden por WhatsApp; quítalos para pagar en línea.</p>
        <button type="button" class="ck-btn" data-ck-close>ENTENDIDO</button>`);
      return;
    }
    state.quote = null; state.rateId = null; state.areaKey = '';
    const d = store.get(FORM_KEY) || {};
    const pieces = cart().reduce((s, i) => s + i.quantity, 0);
    const subtotal = cart().reduce((s, i) => s + (i.finalPrice || i.price) * i.quantity, 0);
    state.subtotal = subtotal;
    const modo = d.modo === 'personal' ? 'personal' : 'envio';
    open(`
      <form id="ck-form" class="ck-form" novalidate>
        <div class="ck-summary"><span>${pieces} pieza${pieces === 1 ? '' : 's'}</span><b>${money(subtotal)} MXN</b></div>

        <fieldset class="ck-group">
          <legend>¿CÓMO LO QUIERES RECIBIR?</legend>
          <div class="ck-rates">
            <label class="ck-rate">
              <input type="radio" name="modo" value="envio" ${modo === 'envio' ? 'checked' : ''}>
              <span class="ck-rate-main"><b>📦 Envío a domicilio</b><small>A todo México por paquetería</small></span>
            </label>
            <label class="ck-rate">
              <input type="radio" name="modo" value="personal" ${modo === 'personal' ? 'checked' : ''}>
              <span class="ck-rate-main"><b>🤝 Entrega personal</b><small>Solo Veracruz y Boca del Río · sin costo de envío</small></span>
              <span class="ck-rate-price">GRATIS</span>
            </label>
          </div>
        </fieldset>

        <fieldset class="ck-group">
          <legend id="ck-datos-title">TUS DATOS</legend>
          ${field('nombre', 'Nombre completo', 'autocomplete="name" required maxlength="60"', d.nombre)}
          <div class="ck-row">
            ${field('telefono', 'WhatsApp (10 números)', 'type="tel" inputmode="numeric" autocomplete="tel-national" required maxlength="14"', d.telefono)}
            ${field('email', 'Correo', 'type="email" autocomplete="email" maxlength="80"', d.email)}
          </div>
        </fieldset>

        <fieldset class="ck-group" id="ck-direccion">
          <legend>DIRECCIÓN DE ENVÍO</legend>
          <div class="ck-row">
            ${field('cp', 'Código postal', 'inputmode="numeric" autocomplete="postal-code" required maxlength="5" pattern="\\d{5}"', d.cp)}
            <label class="ck-field"><span>Estado</span>
              <select name="estado" required>
                <option value="">Elige…</option>
                ${ESTADOS.map((e) => `<option${e === d.estado ? ' selected' : ''}>${e}</option>`).join('')}
              </select>
            </label>
          </div>
          <div class="ck-row">
            ${field('municipio', 'Municipio o ciudad', 'autocomplete="address-level2" required maxlength="60"', d.municipio)}
            ${field('colonia', 'Colonia (si no sale en la lista, escríbela)', 'list="ck-colonias" autocomplete="address-level3" required maxlength="80" placeholder="Escribe tu colonia"', d.colonia)}
          </div>
          <datalist id="ck-colonias"></datalist>
          ${field('calle', 'Calle y número (exterior e interior)', 'autocomplete="address-line1" required maxlength="80" placeholder="Ej. Av. Juárez 123 int. 4"', d.calle)}
          ${field('referencias', 'Referencias (opcional)', 'maxlength="120" placeholder="Entre calles, color de la casa…"', d.referencias)}
        </fieldset>

        <div id="ck-personal" class="ck-note" hidden>Te escribimos por <b>WhatsApp</b> para quedar en el punto y la hora de entrega en <b>Veracruz o Boca del Río</b>. Puedes pagar ahora con tarjeta o al recibir.</div>
        <div id="ck-alert" class="ck-alert" hidden></div>
        <div id="ck-shipping"></div>
        <button type="submit" id="ck-submit" class="ck-btn">VER OPCIONES DE ENVÍO</button>
        <button type="button" id="ck-wa-personal" class="ck-btn ck-btn-wa" hidden>PREFIERO PAGAR AL RECIBIR (WHATSAPP)</button>
        <p class="ck-fine">Pagas en la página segura de Mercado Pago: tarjeta de crédito o débito, OXXO o SPEI. Nosotros nunca vemos los datos de tu tarjeta.</p>
      </form>`);

    const form = $('#ck-form');
    form.addEventListener('input', onInput);
    form.addEventListener('change', onInput);
    form.addEventListener('submit', onSubmit);
    $('#ck-wa-personal').addEventListener('click', pedirPorWhatsApp);
    if (d.cp && !d.colonia) lookupCp(d.cp);
    aplicarModo();
  }

  const modoActual = () => (($('#ck-form [name="modo"]:checked') || {}).value === 'personal' ? 'personal' : 'envio');

  // Entrega personal: sin dirección ni paquetería; envío a domicilio: como siempre
  function aplicarModo() {
    const personal = modoActual() === 'personal';
    $('#ck-direccion').hidden = personal;
    $('#ck-personal').hidden = !personal;
    $('#ck-wa-personal').hidden = !personal;
    $('#ck-datos-title').textContent = personal ? 'TUS DATOS PARA QUEDAR' : '¿A QUIÉN SE LO ENVIAMOS?';
    $('#ck-form [name="email"]').previousElementSibling.textContent = personal ? 'Correo (opcional)' : 'Correo';
    if (personal) {
      state.quote = null; state.rateId = null;
      $('#ck-shipping').innerHTML = `<div class="ck-totals"><div><span>Productos</span><b>${money(state.subtotal)}</b></div><div><span>Entrega personal</span><b>GRATIS</b></div><div class="ck-grand"><span>TOTAL</span><b>${money(state.subtotal)} MXN</b></div></div>`;
      $('#ck-submit').textContent = `PAGAR ${money(state.subtotal)} AHORA CON TARJETA`;
    } else if (!state.quote) {
      $('#ck-shipping').innerHTML = '';
      $('#ck-submit').textContent = 'VER OPCIONES DE ENVÍO';
    }
  }

  // Pagar al recibir: se manda el pedido por WhatsApp, igual que el botón del carrito
  function pedirPorWhatsApp() {
    const v = read();
    const err = validate(v, 'personal');
    if (err) return alertMsg(err);
    alertMsg('');
    const lineas = cart().map((i, n) => {
      const extra = typeof customizationLines === 'function' ? customizationLines(i).map((l) => `\n   ✍️ ${l}`).join('') : '';
      return `${n + 1}. ${i.name} · Talla ${i.size || 'Unitalla'} · x${i.quantity} → $${(i.finalPrice || i.price) * i.quantity}${extra}`;
    }).join('\n');
    const msg = `🤝 *ENTREGA PERSONAL - PUERTO HYPE*\n\nHola! Soy ${v.nombre.trim()} y quiero estos productos con entrega personal en Veracruz / Boca del Río, pagando al recibir:\n\n${lineas}\n\n💰 *Total: $${state.subtotal.toLocaleString('es-MX')} MXN* (sin envío)\n📱 Mi WhatsApp: ${v.telefono}\n\n¿Dónde y a qué hora nos vemos?`;
    const num = (app() && app().whatsappNumber) || '5212294135613';
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  const read = () => Object.fromEntries(new FormData($('#ck-form')).entries());
  const areaKey = (v) => norm([v.cp, v.estado, v.municipio, v.colonia].join('|'));

  function alertMsg(msg) {
    const a = $('#ck-alert');
    a.textContent = msg || '';
    a.hidden = !msg;
    if (msg) a.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function onInput(e) {
    const v = read();
    store.set(FORM_KEY, v);
    if (e.target.name === 'modo') { aplicarModo(); return; }
    if (modoActual() === 'personal') return;
    if (e.target.name === 'cp' && /^\d{5}$/.test(v.cp)) lookupCp(v.cp);
    // Si cambia la dirección, la cotización anterior ya no sirve
    if (state.quote && areaKey(v) !== state.areaKey) {
      state.quote = null; state.rateId = null;
      $('#ck-shipping').innerHTML = '';
      $('#ck-submit').textContent = 'VER OPCIONES DE ENVÍO';
    }
  }

  // Autocompleta estado y colonias con el código postal (si el servicio responde)
  let cpLookup = '';
  async function lookupCp(cp) {
    if (cpLookup === cp) return;
    cpLookup = cp;
    try {
      const res = await fetch(`https://api.zippopotam.us/mx/${cp}`);
      if (!res.ok || cpLookup !== cp) return;
      const data = await res.json();
      const places = (data.places || []).map((p) => p['place name']).filter(Boolean);
      $('#ck-colonias').innerHTML = places.map((p) => `<option value="${esc(p)}">`).join('');
      const raw = norm(data.places && data.places[0] && data.places[0].state);
      const alias = { 'distrito federal': 'Ciudad de México', 'mexico': 'Estado de México', 'coahuila de zaragoza': 'Coahuila', 'michoacan de ocampo': 'Michoacán', 'veracruz de ignacio de la llave': 'Veracruz' };
      const estado = alias[raw] || ESTADOS.find((e) => norm(e) === raw) || ESTADOS.find((e) => raw.startsWith(norm(e) + ' '));
      const sel = $('#ck-form [name="estado"]');
      if (estado && sel && !sel.value) { sel.value = estado; sel.dispatchEvent(new Event('change', { bubbles: true })); }
      const col = $('#ck-form [name="colonia"]');
      if (col && !col.value && places.length === 1) { col.value = places[0]; col.dispatchEvent(new Event('input', { bubbles: true })); }
    } catch (e) { /* se llena a mano */ }
  }

  function validate(v, modo = 'envio') {
    if (v.nombre.trim().length < 3) return 'Escribe tu nombre completo';
    if (!/^\d{10}$/.test(v.telefono.replace(/\D/g, '').replace(/^52(?=\d{10}$)/, ''))) return 'Escribe tu WhatsApp a 10 números';
    if (modo === 'personal') return v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()) ? 'Escribe un correo válido (o déjalo vacío)' : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) return 'Escribe un correo válido';
    if (!/^\d{5}$/.test(v.cp)) return 'Escribe tu código postal (5 números)';
    if (!v.estado) return 'Elige tu estado';
    if (v.municipio.trim().length < 2) return 'Escribe tu municipio o ciudad';
    if (v.colonia.trim().length < 2) return 'Escribe tu colonia';
    if (v.calle.trim().length < 4 || !/\d/.test(v.calle)) return 'Escribe tu calle y número';
    return '';
  }

  async function onSubmit(e) {
    e.preventDefault();
    const v = read();
    const modo = modoActual();
    const err = validate(v, modo);
    if (err) return alertMsg(err);
    alertMsg('');
    const btn = $('#ck-submit');
    btn.disabled = true;

    if (modo === 'personal') {
      btn.textContent = 'ABRIENDO MERCADO PAGO…';
      try {
        const r = await api({ action: 'pay', entrega: 'personal', items: cartLines(), address: { nombre: v.nombre, telefono: v.telefono, email: v.email }, prueba: testMode() });
        store.set(LAST_KEY, { folio: r.folio, at: Date.now() });
        window.location.href = r.url;
      } catch (ex) {
        alertMsg(ex.message);
        aplicarModo();
        btn.disabled = false;
      }
      return;
    }

    if (!state.quote) {
      btn.textContent = 'COTIZANDO ENVÍO…';
      $('#ck-shipping').innerHTML = '<p class="ck-loading">Buscando las mejores paqueterías para tu código postal…</p>';
      try {
        state.quote = await api({ action: 'quote', items: cartLines(), address: v, prueba: testMode() });
        state.areaKey = areaKey(v);
        state.rateId = state.quote.rates[0].id;
        renderRates();
      } catch (ex) {
        $('#ck-shipping').innerHTML = '';
        btn.textContent = 'VER OPCIONES DE ENVÍO';
        alertMsg(ex.message);
      } finally { btn.disabled = false; }
      return;
    }

    btn.textContent = 'ABRIENDO MERCADO PAGO…';
    try {
      const r = await api({ action: 'pay', items: cartLines(), address: v, quoteToken: state.quote.quoteToken, rateId: state.rateId, prueba: testMode() });
      store.set(LAST_KEY, { folio: r.folio, at: Date.now() });
      window.location.href = r.url;
    } catch (ex) {
      alertMsg(ex.message);
      if (/cotiza/i.test(ex.message)) { state.quote = null; $('#ck-shipping').innerHTML = ''; btn.textContent = 'VER OPCIONES DE ENVÍO'; } else { updatePayButton(); }
      btn.disabled = false;
    }
  }

  function renderRates() {
    const q = state.quote;
    const days = (d) => (d ? `${d} día${d == 1 ? '' : 's'} hábil${d == 1 ? '' : 'es'}` : '');
    $('#ck-shipping').innerHTML = `
      <fieldset class="ck-group">
        <legend>ELIGE TU ENVÍO</legend>
        <div class="ck-rates">
          ${q.rates.map((r) => `
            <label class="ck-rate">
              <input type="radio" name="rate" value="${esc(r.id)}" ${r.id === state.rateId ? 'checked' : ''}>
              <span class="ck-rate-main"><b>${esc(r.carrier)}</b><small>${esc(r.service || '')}${r.days ? ' · ' + days(r.days) : ''}</small></span>
              <span class="ck-rate-price">${money(r.total)}</span>
            </label>`).join('')}
        </div>
        ${q.allInStock ? '' : '<p class="ck-note">Tu pedido incluye jerseys <b>sobre pedido</b>: tardan unos días más en llegarnos. Te mandamos tu número de guía en cuanto salga.</p>'}
      </fieldset>
      <div class="ck-totals">
        <div><span>Productos</span><b>${money(q.subtotal)}</b></div>
        <div><span>Envío</span><b id="ck-ship-total"></b></div>
        <div class="ck-grand"><span>TOTAL</span><b id="ck-grand-total"></b></div>
      </div>`;
    $('#ck-shipping').addEventListener('change', (e) => { if (e.target.name === 'rate') { state.rateId = e.target.value; updatePayButton(); } });
    updatePayButton();
  }

  function updatePayButton() {
    const q = state.quote;
    if (!q) return;
    const rate = q.rates.find((r) => r.id === state.rateId) || q.rates[0];
    const total = q.subtotal + rate.total;
    $('#ck-ship-total').textContent = money(rate.total);
    $('#ck-grand-total').textContent = `${money(total)} MXN`;
    $('#ck-submit').textContent = `PAGAR ${money(total)} CON MERCADO PAGO`;
  }

  // ---------- regreso de Mercado Pago ----------
  let pollTimer;
  function statusView(o) {
    const lines = o.lines.map((l) => `<li><span>${l.quantity}× ${esc(l.name)} · ${esc(l.size)}</span><b>${money(l.total)}</b></li>`).join('');
    const box = {
      pagado: ['✅', '¡PAGO RECIBIDO!', o.shipping && o.shipping.personal ? 'En un momento te escribimos por WhatsApp para quedar en el punto y la hora de entrega en Veracruz o Boca del Río.' : o.allInStock ? 'Ya estamos preparando tu paquete. Aquí te aparece tu número de guía en cuanto esté lista.' : 'Ya quedó tu pedido. Los jerseys sobre pedido tardan unos días; te mandamos la guía en cuanto salgan.'],
      guia_lista: ['📦', '¡TU GUÍA ESTÁ LISTA!', 'Tu paquete sale en cuanto la paquetería lo recoja.'],
      enviado: ['🚚', '¡TU PEDIDO VA EN CAMINO!', 'Puedes rastrearlo con tu número de guía.'],
      pendiente_pago: ['⏳', 'PAGO PENDIENTE', 'Si pagaste en OXXO o por SPEI, puede tardar en confirmarse. Esta página se actualiza sola.'],
      rechazado: ['⚠️', 'EL PAGO NO PASÓ', 'Tu banco o Mercado Pago rechazó el pago. Intenta con otra tarjeta u otro método.'],
      cancelado: ['✖️', 'PEDIDO CANCELADO', 'Si fue un error, escríbenos por WhatsApp.'],
    }[o.status] || ['ℹ️', 'ESTAMOS REVISANDO TU PEDIDO', 'Te escribimos por WhatsApp en un momento.'];
    const track = o.tracking ? `<div class="ck-track"><span>Guía ${esc(o.shipping ? o.shipping.carrier : '')}</span><b>${esc(o.tracking.number)}</b>${o.tracking.url ? `<a href="${esc(o.tracking.url)}" target="_blank" rel="noopener">Rastrear ↗</a>` : ''}</div>` : '';
    const wa = `https://wa.me/${(app() && app().whatsappNumber) || '5212294135613'}?text=${encodeURIComponent(`Hola! Tengo una duda de mi pedido ${o.folio}`)}`;
    return `
      <div class="ck-status">
        <div class="ck-status-icon">${box[0]}</div>
        <h3>${box[1]}</h3>
        <p>${box[2]}</p>
        <div class="ck-folio">Folio <b>${esc(o.folio)}</b></div>
        ${track}
        <ul class="ck-lines">${lines}</ul>
        <div class="ck-totals">
          <div><span>Productos</span><b>${money(o.subtotal)}</b></div>
          ${o.shipping ? (o.shipping.personal ? '<div><span>Entrega personal</span><b>GRATIS</b></div>' : `<div><span>Envío ${esc(o.shipping.carrier)}</span><b>${money(o.shipping.total)}</b></div>`) : ''}
          <div class="ck-grand"><span>TOTAL</span><b>${money(o.total)} MXN</b></div>
        </div>
        ${o.status === 'rechazado' ? '<button type="button" class="ck-btn" id="ck-retry">INTENTAR DE NUEVO</button>' : ''}
        <a class="ck-btn ck-btn-wa" href="${wa}" target="_blank" rel="noopener">DUDAS POR WHATSAPP</a>
      </div>`;
  }

  async function showOrder(folio, t, paymentId, tries = 0) {
    if (tries === 0) open('<p class="ck-loading">Revisando tu pago…</p>');
    try {
      const o = await api({ action: 'status', folio, t, paymentId });
      if ($('#ck-modal').hidden) return;
      $('#ck-title').textContent = 'TU PEDIDO';
      $('#ck-body').innerHTML = statusView(o);
      const retry = $('#ck-retry');
      if (retry) retry.addEventListener('click', openCheckout);
      if (['pagado', 'guia_lista', 'enviado'].includes(o.status) && app() && app().cart.length) {
        app().cart = [];
        if (typeof saveCart === 'function') saveCart();
        if (typeof updateCartUI === 'function') updateCartUI();
      }
      const waiting = o.status === 'pendiente_pago' || (o.status === 'pagado' && o.allInStock && !o.tracking);
      if (waiting && tries < 20) pollTimer = setTimeout(() => showOrder(folio, t, paymentId, tries + 1), tries < 5 ? 3000 : 8000);
    } catch (ex) {
      $('#ck-body').innerHTML = `<p class="ck-note">${esc(ex.message)}</p><button type="button" class="ck-btn" data-ck-close>CERRAR</button>`;
    }
  }

  function checkReturn() {
    const qs = new URLSearchParams(location.search);
    const folio = qs.get('pedido');
    const t = qs.get('t');
    if (!folio || !t) return;
    const paymentId = qs.get('payment_id') || qs.get('collection_id') || '';
    // Limpia la barra de direcciones pero conserva el link al pedido en el historial
    history.replaceState(null, '', location.pathname);
    showOrder(folio, t, paymentId);
  }

  // ---------- botón en el carrito ----------
  function syncButton() {
    const btn = $('#btn-card-checkout');
    if (!btn) return;
    btn.hidden = !(checkoutActivo || testMode());
    const promo = $('#ck-promo');
    if (promo) promo.hidden = btn.hidden;
    const empty = cart().length === 0;
    btn.disabled = empty;
    btn.style.opacity = empty ? '0.5' : '1';
    btn.title = hasQuoteItems() ? 'Los productos por cotizar se piden por WhatsApp' : '';
  }

  function init() {
    const btn = $('#btn-card-checkout');
    if (btn) btn.addEventListener('click', openCheckout);
    if (typeof window.updateCartUI === 'function') {
      const original = window.updateCartUI;
      window.updateCartUI = function () { const r = original.apply(this, arguments); syncButton(); return r; };
    }
    syncButton();
    checkReturn();
    // ¿Ya está activo el pago para todos? (lo dice el servidor)
    fetch('/api/checkout?stock=1').then((r) => r.json()).then((d) => { checkoutActivo = Boolean(d && d.checkout); syncButton(); }).catch(() => {});
  }

  window.PHCheckout = { open: openCheckout };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
