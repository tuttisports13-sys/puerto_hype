// Panel Admin Puerto Hype: productos, reseñas y textos de la página.
// Todo se guarda en el repo de GitHub a través de /api/admin-*; Vercel publica solo en 1–2 min.
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  // Rutas como "images/x.jpg" están publicadas en la misma web; las URLs completas se usan tal cual
  const imgUrl = (u) => (!u ? '' : /^(https?:|data:)/.test(u) ? u : '/' + u.replace(/^\//, ''));
  const money = (n) => `$${Number(n || 0).toLocaleString('es-MX')} MXN`;

  const state = {
    token: localStorage.getItem('admin_token'),
    products: [],
    reviews: [],
    filter: 'all',
    query: '',
    view: 'dashboard',
    editingId: null,
    gallery: [], // [{ url } | { pending: true, preview, key }]
    sizes: [],
  };

  // ---------------- utilidades de UI ----------------
  let toastTimer;
  function toast(msg, type = 'ok') {
    const t = $('#toast');
    t.textContent = msg;
    t.className = `toast ${type === 'error' ? 'error' : ''}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.add('hidden'), 3600);
  }
  function busy(on, text = 'Guardando…') {
    $('#busy-text').textContent = text;
    $('#busy').classList.toggle('hidden', !on);
  }

  async function api(path, payload = {}) {
    const res = await fetch(`/api/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: state.token, ...payload }),
    });
    let data = {};
    try { data = await res.json(); } catch (e) { /* respuesta vacía */ }
    if (res.status === 401) {
      logout('Tu sesión expiró. Vuelve a entrar.');
      throw new Error('Sesión expirada');
    }
    if (!res.ok || data.success === false) throw new Error(data.error || `Error ${res.status}`);
    return data;
  }

  // ---------------- grupos (igual que la tienda) ----------------
  function group(p) {
    if (p.category === 'mayoreo' || String(p.id).startsWith('lote-')) return 'mayoreo';
    if (/local|visita|jersey|portugal 20/i.test(p.name)) return 'jerseys';
    const shoe = (p.sizes || []).some((sz) => {
      const s = String(sz).trim(); const n = parseFloat(s);
      return (/^\d{2}(\.5)?\s*(cm)?$/i.test(s) && n >= 21 && n <= 32) || /^\d{1,2}(\.5)?\s*(mx|us)$/i.test(s);
    });
    return shoe ? 'calzado' : 'outlet';
  }

  // ---------------- login / sesión ----------------
  function showApp() {
    $('#login-view').classList.add('hidden');
    $('#app-view').classList.remove('hidden');
    go(location.hash.replace('#', '') || 'dashboard');
    loadProducts();
    loadPending();
  }
  function logout(msg) {
    localStorage.removeItem('admin_token');
    state.token = null;
    $('#app-view').classList.add('hidden');
    $('#login-view').classList.remove('hidden');
    if (msg) { $('#login-alert').textContent = msg; $('#login-alert').classList.remove('hidden'); }
  }

  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('#btn-login');
    btn.disabled = true; btn.textContent = 'ENTRANDO…';
    $('#login-alert').classList.add('hidden');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: $('#email').value, password: $('#password').value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || 'Correo o contraseña incorrectos');
      state.token = data.token;
      localStorage.setItem('admin_token', data.token);
      $('#password').value = '';
      showApp();
    } catch (err) {
      $('#login-alert').textContent = err.message === 'Credenciales invalidas' ? 'Correo o contraseña incorrectos' : err.message;
      $('#login-alert').classList.remove('hidden');
    } finally {
      btn.disabled = false; btn.textContent = 'ENTRAR AL PANEL';
    }
  });
  $('#btn-logout').addEventListener('click', () => logout());

  // ---------------- navegación ----------------
  const VIEWS = ['dashboard', 'products', 'new', 'reviews', 'texts'];
  function go(view) {
    if (!VIEWS.includes(view)) view = 'dashboard';
    // "Agregar" siempre abre el formulario vacío, salvo cuando venimos de "Editar"
    if (view === 'new' && !state._openingEditor && uploading === 0) resetEditor();
    state._openingEditor = false;
    state.view = view;
    VIEWS.forEach((v) => $(`#view-${v}`).classList.toggle('hidden', v !== view));
    // Al editar un producto se marca "Productos" en el menú; "Agregar" solo para productos nuevos
    const navView = view === 'new' && state.editingId ? 'products' : view;
    $$('[data-view]').forEach((b) => b.classList.toggle('active', b.dataset.view === navView));
    if (location.hash !== `#${view}`) history.replaceState(null, '', `#${view}`);
    window.scrollTo({ top: 0 });
    if (view === 'reviews') { loadPending(); loadReviews(); }
    if (view === 'texts') loadTexts();
  }
  $$('[data-view]').forEach((b) => b.addEventListener('click', () => go(b.dataset.view)));
  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-go]');
    if (g) go(g.dataset.go);
  });

  // ---------------- productos ----------------
  async function loadProducts() {
    $('#product-grid').innerHTML = '<p class="empty">Cargando productos…</p>';
    try {
      const { products } = await api('admin-products', { action: 'list' });
      state.products = products || [];
      renderProducts();
      renderStats();
    } catch (err) {
      $('#product-grid').innerHTML = `<p class="empty">No se pudieron cargar los productos: ${esc(err.message)}</p>`;
    }
  }
  $('#btn-reload').addEventListener('click', loadProducts);
  $('#product-search').addEventListener('input', (e) => { state.query = e.target.value.toLowerCase().trim(); renderProducts(); });
  $$('#product-filters .filter-pill').forEach((b) => b.addEventListener('click', () => {
    state.filter = b.dataset.filter;
    $$('#product-filters .filter-pill').forEach((x) => x.classList.toggle('active', x === b));
    renderProducts();
  }));

  function renderStats() {
    const ps = state.products;
    const count = (g) => ps.filter((p) => group(p) === g).length;
    const stats = [
      ['dark', ps.filter((p) => !p.hidden).length, 'En la tienda'],
      ['', count('mayoreo'), 'Lotes mayoreo'],
      ['', count('jerseys'), 'Jerseys'],
      ['', count('calzado'), 'Calzado'],
      ['', count('outlet'), 'Outlet'],
      ['', ps.filter((p) => p.soldOut).length, 'Agotados'],
      ['', ps.filter((p) => p.hidden).length, 'Ocultos'],
    ];
    $('#stats').innerHTML = stats.map(([cls, n, label]) => `<div class="stat ${cls}"><b>${n}</b><span>${label}</span></div>`).join('');
  }

  function renderProducts() {
    const list = state.products.filter((p) => {
      if (state.query && !p.name.toLowerCase().includes(state.query)) return false;
      if (state.filter === 'all') return true;
      if (state.filter === 'soldOut') return p.soldOut;
      if (state.filter === 'hidden') return p.hidden;
      return group(p) === state.filter;
    });
    if (!list.length) {
      $('#product-grid').innerHTML = '<p class="empty">No hay productos aquí.</p>';
      return;
    }
    $('#product-grid').innerHTML = list.map((p) => `
      <article class="p-card ${p.hidden ? 'is-hidden' : ''}" data-id="${esc(p.id)}">
        <div class="p-thumb" data-act="edit">
          <img src="${esc(imgUrl(p.image))}" alt="${esc(p.name)}" loading="lazy">
          <div class="p-badges">
            ${p.soldOut ? '<span class="tag red">AGOTADO</span>' : ''}
            ${p.hidden ? '<span class="tag gray">OCULTO</span>' : ''}
            ${!p.soldOut && p.badge ? `<span class="tag">${esc(p.badge)}</span>` : ''}
          </div>
        </div>
        <div class="p-body">
          <div class="p-name">${esc(p.name)}</div>
          <div class="p-price">${money(p.price)}</div>
          <div class="p-sizes">${p.sizes && p.sizes.length ? 'Tallas: ' + esc(p.sizes.join(', ')) : 'Sin tallas'}</div>
          <div class="p-actions">
            <button type="button" class="btn btn-primary btn-edit" data-act="edit">✎ EDITAR</button>
            <button type="button" class="btn btn-secondary" data-act="soldOut">${p.soldOut ? 'DISPONIBLE' : 'AGOTADO'}</button>
            <button type="button" class="btn btn-ghost" data-act="hidden">${p.hidden ? 'MOSTRAR' : 'OCULTAR'}</button>
          </div>
        </div>
      </article>`).join('');
  }

  $('#product-grid').addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const id = btn.closest('.p-card').dataset.id;
    const p = state.products.find((x) => x.id === id);
    if (!p) return;
    const act = btn.dataset.act;
    if (act === 'edit') return openEditor(p);
    const value = !p[act];
    busy(true, 'Actualizando…');
    try {
      await api('admin-products', { action: 'update', id, product: { [act]: value } });
      p[act] = value;
      renderProducts(); renderStats();
      toast(act === 'soldOut' ? (value ? 'Marcado como agotado' : 'Disponible otra vez') : (value ? 'Oculto de la tienda' : 'Visible en la tienda'));
    } catch (err) {
      toast(err.message, 'error');
    } finally { busy(false); }
  });

  // ---------------- editor ----------------
  function resetEditor() {
    state.editingId = null;
    state.gallery = [];
    state.sizes = [];
    $('#product-form').reset();
    $('#f-badge').value = 'NUEVO';
    $('#editor-tag').textContent = 'NUEVO';
    $('#editor-title').textContent = 'AGREGAR PRODUCTO';
    $('#btn-save').textContent = 'GUARDAR PRODUCTO';
    $('#btn-delete').classList.add('hidden');
    $('#btn-cancel-edit').classList.add('hidden');
    renderGallery(); renderSizes();
  }

  function openEditor(p) {
    state.editingId = p.id;
    const gal = Array.isArray(p.gallery) && p.gallery.length ? p.gallery : [p.image].filter(Boolean);
    state.gallery = gal.map((url) => ({ url }));
    state.sizes = [...(p.sizes || [])];
    $('#f-name').value = p.name || '';
    $('#f-price').value = p.price || '';
    $('#f-category').value = p.category === 'mayoreo' ? 'mayoreo' : 'sneakers';
    $('#f-description').value = p.description || '';
    const badge = p.badge || '';
    if (![...$('#f-badge').options].some((o) => o.value === badge)) $('#f-badge').add(new Option(badge, badge));
    $('#f-badge').value = badge;
    $('#f-soldout').checked = !!p.soldOut;
    $('#f-hidden').checked = !!p.hidden;
    $('#editor-tag').textContent = 'EDITANDO';
    $('#editor-title').textContent = p.name;
    $('#btn-save').textContent = 'GUARDAR CAMBIOS';
    $('#btn-delete').classList.remove('hidden');
    $('#btn-cancel-edit').classList.remove('hidden');
    renderGallery(); renderSizes();
    state._openingEditor = true;
    go('new');
  }
  $('#btn-cancel-edit').addEventListener('click', () => { resetEditor(); go('products'); });

  // Fotos
  function renderGallery() {
    $('#photo-grid').innerHTML = state.gallery.map((g, i) => `
      <div class="photo ${i === 0 ? 'cover' : ''} ${g.pending ? 'uploading' : ''}">
        <img src="${esc(g.pending ? g.preview : imgUrl(g.url))}" alt="Foto ${i + 1}">
        ${i === 0 ? '<span class="tag cover-tag">PORTADA</span>' : ''}
        ${g.pending ? '' : `<div class="photo-tools">
          <button type="button" data-ph="left" data-i="${i}" ${i === 0 ? 'disabled' : ''} title="Mover a la izquierda">←</button>
          ${i === 0 ? '' : `<button type="button" data-ph="cover" data-i="${i}" title="Hacer portada">★</button>`}
          <button type="button" data-ph="right" data-i="${i}" ${i === state.gallery.length - 1 ? 'disabled' : ''} title="Mover a la derecha">→</button>
          <button type="button" class="del" data-ph="del" data-i="${i}" title="Quitar foto">✕</button>
        </div>`}
      </div>`).join('');
  }
  $('#photo-grid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-ph]');
    if (!b) return;
    const i = Number(b.dataset.i);
    const g = state.gallery;
    if (b.dataset.ph === 'del') g.splice(i, 1);
    if (b.dataset.ph === 'left' && i > 0) [g[i - 1], g[i]] = [g[i], g[i - 1]];
    if (b.dataset.ph === 'right' && i < g.length - 1) [g[i + 1], g[i]] = [g[i], g[i + 1]];
    if (b.dataset.ph === 'cover') g.unshift(...g.splice(i, 1));
    renderGallery();
  });

  function compress(file, max = 1200, quality = 0.75) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(img.src);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  let uploading = 0;
  $('#photo-input').addEventListener('change', async (e) => {
    const files = [...e.target.files];
    e.target.value = '';
    for (const file of files) {
      const key = Math.random().toString(36).slice(2);
      let data;
      try { data = await compress(file); } catch (err) { toast('No se pudo leer una foto', 'error'); continue; }
      state.gallery.push({ pending: true, preview: data, key });
      renderGallery();
      uploading++; updateSaveState();
      try {
        const { url } = await api('admin-upload', { imageBase64: data });
        const g = state.gallery.find((x) => x.key === key);
        if (g) { delete g.pending; delete g.preview; delete g.key; g.url = url; }
      } catch (err) {
        state.gallery = state.gallery.filter((x) => x.key !== key);
        toast(`No se pudo subir una foto: ${err.message}`, 'error');
      } finally {
        uploading--; updateSaveState(); renderGallery();
      }
    }
  });
  function updateSaveState() {
    $('#btn-save').disabled = uploading > 0;
    if (uploading > 0) $('#btn-save').textContent = `SUBIENDO FOTOS (${uploading})…`;
    else $('#btn-save').textContent = state.editingId ? 'GUARDAR CAMBIOS' : 'GUARDAR PRODUCTO';
  }

  // Tallas
  function renderSizes() {
    $('#size-chips').innerHTML = state.sizes.map((s, i) => `<span class="chip">${esc(s)}<button type="button" data-size-del="${i}" aria-label="Quitar ${esc(s)}">✕</button></span>`).join('');
  }
  function addSizes(raw) {
    String(raw).split(',').map((s) => s.trim()).filter(Boolean).forEach((s) => { if (!state.sizes.includes(s)) state.sizes.push(s); });
    renderSizes();
  }
  $('#size-chips').addEventListener('click', (e) => {
    const b = e.target.closest('[data-size-del]');
    if (b) { state.sizes.splice(Number(b.dataset.sizeDel), 1); renderSizes(); }
  });
  $('#btn-add-size').addEventListener('click', () => { addSizes($('#size-input').value); $('#size-input').value = ''; $('#size-input').focus(); });
  $('#size-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); $('#btn-add-size').click(); } });
  $$('.quick-sizes button').forEach((b) => b.addEventListener('click', () => addSizes(b.dataset.sizes)));

  // Guardar / eliminar
  $('#product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (uploading > 0) return;
    if ($('#size-input').value.trim()) { addSizes($('#size-input').value); $('#size-input').value = ''; }
    const product = {
      name: $('#f-name').value.trim(),
      price: Number($('#f-price').value),
      category: $('#f-category').value,
      sizes: state.sizes,
      description: $('#f-description').value.trim(),
      badge: $('#f-badge').value,
      soldOut: $('#f-soldout').checked,
      hidden: $('#f-hidden').checked,
      gallery: state.gallery.filter((g) => g.url).map((g) => g.url),
    };
    if (!product.gallery.length) return toast('Agrega al menos una foto', 'error');
    if (!product.name) return toast('Ponle nombre al producto', 'error');
    if (!(product.price > 0)) return toast('Escribe un precio válido', 'error');

    busy(true, state.editingId ? 'Guardando cambios…' : 'Agregando producto…');
    try {
      if (state.editingId) {
        await api('admin-products', { action: 'update', id: state.editingId, product });
        toast('¡Cambios guardados! Se verán en la tienda en 1–2 min.');
      } else {
        await api('admin-products', { action: 'create', product });
        toast('¡Producto agregado! Se verá en la tienda en 1–2 min.');
      }
      resetEditor();
      await loadProducts();
      go('products');
    } catch (err) {
      toast(err.message, 'error');
    } finally { busy(false); }
  });

  $('#btn-delete').addEventListener('click', async () => {
    const p = state.products.find((x) => x.id === state.editingId);
    if (!p || !confirm(`¿Eliminar "${p.name}" para siempre?\n\nSi solo no quieres que se vea, mejor usa "Oculto".`)) return;
    busy(true, 'Eliminando…');
    try {
      await api('admin-products', { action: 'delete', id: p.id });
      toast('Producto eliminado');
      resetEditor();
      await loadProducts();
      go('products');
    } catch (err) {
      toast(err.message, 'error');
    } finally { busy(false); }
  });

  // ---------------- reseñas ----------------
  async function loadReviews() {
    $('#review-list').innerHTML = '<p class="empty">Cargando reseñas…</p>';
    try {
      const res = await fetch(`/api/get-reviews?t=${Date.now()}`, { cache: 'no-store' });
      state.reviews = res.ok ? await res.json() : [];
      renderReviews();
    } catch (err) {
      $('#review-list').innerHTML = '<p class="empty">No se pudieron cargar las reseñas.</p>';
    }
  }
  function renderReviews() {
    const list = [...state.reviews].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    if (!list.length) { $('#review-list').innerHTML = '<p class="empty">Todavía no hay reseñas.</p>'; return; }
    $('#review-list').innerHTML = list.map((r) => {
      const stars = Math.max(0, Math.min(5, Number(r.stars) || 0));
      return `
      <article class="review" data-id="${esc(r.id)}">
        <div class="review-head"><b>${esc(r.name)}</b><span class="review-stars">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</span></div>
        <span class="review-date">${esc(r.date)}</span>
        ${r.verified ? `<span class="tag green verified">✓ COMPRA VERIFICADA${r.product ? ' · ' + esc(r.product) : ''}</span>` : '<span class="tag gray verified">SIN SELLO</span>'}
        ${r.image ? `<img src="${esc(imgUrl(r.image))}" alt="Foto de ${esc(r.name)}" loading="lazy">` : ''}
        <p>${esc(r.text)}</p>
        <button type="button" class="btn btn-danger btn-sm" data-review-del>ELIMINAR</button>
      </article>`;
    }).join('');
  }
  $('#btn-reload-reviews').addEventListener('click', loadReviews);
  $('#review-list').addEventListener('click', async (e) => {
    if (!e.target.closest('[data-review-del]')) return;
    const id = e.target.closest('.review').dataset.id;
    const r = state.reviews.find((x) => String(x.id) === id);
    if (!confirm(`¿Eliminar la reseña de ${r ? r.name : 'este cliente'}?`)) return;
    busy(true, 'Eliminando reseña…');
    try {
      await api('admin-reviews', { action: 'delete', id });
      state.reviews = state.reviews.filter((x) => String(x.id) !== id);
      renderReviews();
      toast('Reseña eliminada');
    } catch (err) {
      toast(err.message, 'error');
    } finally { busy(false); }
  });

  // ---------------- reseñas por aprobar ----------------
  state.pending = [];
  async function loadPending() {
    if ($('#pending-list')) $('#pending-list').innerHTML = '<p class="empty">Cargando…</p>';
    try {
      const { reviews } = await api('admin-reviews', { action: 'pending' });
      state.pending = reviews || [];
    } catch (err) {
      state.pending = [];
      $('#pending-list').innerHTML = `<p class="empty">No se pudieron cargar: ${esc(err.message)}</p>`;
      return;
    }
    renderPending();
  }
  function renderPending() {
    const n = state.pending.length;
    ['#pending-count', '#dash-pending'].forEach((sel) => {
      $(sel).textContent = n ? `${n} NUEVA${n > 1 ? 'S' : ''}` : '';
      $(sel).classList.toggle('hidden', !n);
    });
    if (!n) { $('#pending-list').innerHTML = '<p class="empty">No hay reseñas nuevas por revisar. 👌</p>'; return; }
    $('#pending-list').innerHTML = state.pending.map((r) => {
      const stars = Math.max(0, Math.min(5, Number(r.stars) || 0));
      return `
      <article class="review" data-id="${esc(r.id)}">
        <div class="review-head"><b>${esc(r.name)}</b><span class="review-stars">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</span></div>
        <span class="review-date">${esc(r.date)}</span>
        <span class="review-product">${r.product ? `Dice que compró: <b>${esc(r.product)}</b>` : 'No dijo qué compró'}</span>
        ${r.image ? `<img src="${esc(imgUrl(r.image))}" alt="Foto de ${esc(r.name)}" loading="lazy">` : ''}
        <p>${esc(r.text)}</p>
        <div class="review-actions">
          <button type="button" class="btn btn-ok btn-sm" data-pend="verified">✓ APROBAR · ES MI CLIENTE</button>
          <button type="button" class="btn btn-secondary btn-sm" data-pend="plain">APROBAR SIN SELLO</button>
          <button type="button" class="btn btn-danger btn-sm" data-pend="reject">RECHAZAR</button>
        </div>
      </article>`;
    }).join('');
  }
  $('#pending-list').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-pend]');
    if (!b) return;
    const id = b.closest('.review').dataset.id;
    const r = state.pending.find((x) => String(x.id) === id);
    const act = b.dataset.pend;
    if (act === 'reject' && !confirm(`¿Rechazar la reseña de ${r ? r.name : 'este cliente'}? Se borra junto con su foto.`)) return;
    busy(true, act === 'reject' ? 'Rechazando…' : 'Publicando reseña…');
    try {
      if (act === 'reject') await api('admin-reviews', { action: 'reject', id });
      else await api('admin-reviews', { action: 'approve', id, verified: act === 'verified' });
      state.pending = state.pending.filter((x) => String(x.id) !== id);
      renderPending();
      if (act !== 'reject') loadReviews();
      toast(act === 'reject' ? 'Reseña rechazada' : act === 'verified' ? '¡Publicada con sello de compra verificada!' : 'Reseña publicada');
    } catch (err) { toast(err.message, 'error'); } finally { busy(false); }
  });
  $('#btn-reload-reviews').addEventListener('click', loadPending);

  // ---------------- textos de la página ----------------
  let textsLoaded = false;
  async function loadTexts() {
    if (textsLoaded) return;
    try {
      const { config } = await api('admin-config', { action: 'get' });
      fillTexts(config || {});
      textsLoaded = true;
    } catch (err) {
      toast(`No se pudieron cargar los textos: ${err.message}`, 'error');
    }
  }
  function tickerRow(value = '') {
    const row = document.createElement('div');
    row.className = 'ticker-row';
    row.innerHTML = `<input type="text" maxlength="120" value="${esc(value)}" placeholder="Ej: ENVÍO GRATIS A TODO MÉXICO"><button type="button" title="Quitar">✕</button>`;
    row.querySelector('button').addEventListener('click', () => { row.remove(); });
    return row;
  }
  function fillTexts(c) {
    const list = $('#ticker-list');
    list.innerHTML = '';
    (c.ticker && c.ticker.length ? c.ticker : ['']).forEach((t) => list.appendChild(tickerRow(t)));
    $('#t-badge').value = c.heroBadge || '';
    $('#t-title').value = c.heroTitle || '';
    $('#t-subtitle').value = c.heroSubtitle || '';
    renderHeroPreview();
  }
  function renderHeroPreview() {
    $('#hero-preview').innerHTML = `
      <div class="preview-label">VISTA PREVIA</div>
      ${$('#t-badge').value ? `<span class="pv-badge">${esc($('#t-badge').value)}</span>` : ''}
      <div class="pv-title">${$('#t-title').value.split('\n').map(esc).join('<br>')}</div>
      <div class="pv-sub">${esc($('#t-subtitle').value)}</div>`;
  }
  ['#t-badge', '#t-title', '#t-subtitle'].forEach((s) => $(s).addEventListener('input', renderHeroPreview));
  $('#btn-add-ticker').addEventListener('click', () => {
    if ($$('#ticker-list .ticker-row').length >= 8) return toast('Máximo 8 anuncios', 'error');
    const row = tickerRow();
    $('#ticker-list').appendChild(row);
    row.querySelector('input').focus();
  });
  $('#texts-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const config = {
      ticker: $$('#ticker-list input').map((i) => i.value.trim()).filter(Boolean),
      heroBadge: $('#t-badge').value.trim(),
      heroTitle: $('#t-title').value.trim(),
      heroSubtitle: $('#t-subtitle').value.trim(),
    };
    if (!config.ticker.length) return toast('Escribe al menos un anuncio', 'error');
    if (!config.heroTitle) return toast('El título no puede ir vacío', 'error');
    busy(true, 'Guardando textos…');
    try {
      const { config: saved } = await api('admin-config', { config });
      fillTexts(saved);
      toast('¡Textos guardados! Se verán en la tienda en 1–2 min.');
    } catch (err) {
      toast(err.message, 'error');
    } finally { busy(false); }
  });

  // ---------------- inicio ----------------
  resetEditor();
  if (state.token) showApp();
})();
