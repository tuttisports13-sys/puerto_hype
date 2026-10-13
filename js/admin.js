document.addEventListener('DOMContentLoaded', () => {
  const loginContainer = document.getElementById('login-container');
  const adminContainer = document.getElementById('admin-container');
  const loginForm = document.getElementById('login-form');
  const productForm = document.getElementById('product-form');
  const loginAlert = document.getElementById('login-alert');
  const adminAlert = document.getElementById('admin-alert');
  const imagePreviewBox = document.getElementById('image-preview-box');
  const fileInput = document.getElementById('product-image');
  const imagePlaceholder = document.getElementById('image-placeholder');
  
  const tabBtnAdd = document.getElementById('tab-btn-add');
  const tabBtnStock = document.getElementById('tab-btn-stock');
  const tabContentAdd = document.getElementById('tab-content-add');
  const tabContentStock = document.getElementById('tab-content-stock');
  const btnLogout = document.getElementById('btn-logout');
  const btnRefreshStock = document.getElementById('btn-refresh-stock');
  const stockSearchInput = document.getElementById('stock-search');
  const adminProductList = document.getElementById('admin-product-list');

  let currentToken = localStorage.getItem('admin_token');
  let currentImagesBase64 = [];
  let loadedStockProducts = [];

  if (currentToken) {
    showAdmin();
  }

  // --- TABS LOGIC ---
  tabBtnAdd.addEventListener('click', () => {
    tabBtnAdd.classList.add('active');
    tabBtnStock.classList.remove('active');
    tabContentAdd.classList.remove('hidden');
    tabContentStock.classList.add('hidden');
  });

  tabBtnStock.addEventListener('click', () => {
    tabBtnStock.classList.add('active');
    tabBtnAdd.classList.remove('active');
    tabContentStock.classList.remove('hidden');
    tabContentAdd.classList.add('hidden');
    loadAdminProducts();
  });

  if (btnRefreshStock) {
    btnRefreshStock.addEventListener('click', () => {
      loadAdminProducts();
    });
  }

  if (stockSearchInput) {
    stockSearchInput.addEventListener('input', (e) => {
      renderAdminProducts(e.target.value.toLowerCase().trim());
    });
  }

  // --- LOGOUT ---
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('admin_token');
      currentToken = null;
      showLogin();
    });
  }

  // --- LOGIN ---
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-login');
    const originalText = btn.textContent;
    btn.innerHTML = '<span class="loader"></span> Entrando...';
    btn.disabled = true;
    loginAlert.classList.add('hidden');

    try {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        localStorage.setItem('admin_token', data.token);
        currentToken = data.token;
        showAdmin();
      } else {
        loginAlert.textContent = data.error || 'Credenciales incorrectas';
        loginAlert.classList.remove('hidden');
      }
    } catch (err) {
      loginAlert.textContent = 'Error de conexión con el servidor';
      loginAlert.classList.remove('hidden');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });

  // --- IMAGE COMPRESSION & PREVIEW ---
  imagePreviewBox.addEventListener('click', () => {
    fileInput.click();
  });

  function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height *= maxWidth / width));
              width = maxWidth;
            } else {
              width = Math.round((width *= maxHeight / height));
              height = maxHeight;
            }
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  }

  fileInput.addEventListener('change', async () => {
    const files = Array.from(fileInput.files);
    if (files.length > 0) {
      currentImagesBase64 = [];
      const existingImgs = imagePreviewBox.querySelectorAll('img');
      existingImgs.forEach(img => img.remove());
      imagePlaceholder.style.display = 'none';
      imagePreviewBox.style.opacity = '0.5';

      for (let i = 0; i < files.length; i++) {
        try {
          const compressed = await compressImage(files[i], 1000, 1000, 0.7);
          currentImagesBase64.push(compressed);
          const img = document.createElement('img');
          img.src = compressed;
          imagePreviewBox.appendChild(img);
        } catch (err) {
          console.error("Error comprimiendo imagen", err);
        }
      }
      imagePreviewBox.style.opacity = '1';
    } else {
      currentImagesBase64 = [];
      const existingImgs = imagePreviewBox.querySelectorAll('img');
      existingImgs.forEach(img => img.remove());
      imagePlaceholder.style.display = 'block';
    }
  });

  // --- ADD PRODUCT TO STOCK ---
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (currentImagesBase64.length === 0) {
      showAlert('Por favor, selecciona al menos una foto.', 'error');
      return;
    }

    const btn = document.getElementById('btn-save');
    const originalText = btn.textContent;
    btn.innerHTML = '<span class="loader"></span> Guardando en Stock...';
    btn.disabled = true;
    adminAlert.classList.add('hidden');

    try {
      const name = document.getElementById('product-name').value;
      const price = document.getElementById('product-price').value;
      const sizes = document.getElementById('product-sizes').value;

      const res = await fetch('/api/add-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: currentToken,
          name,
          price,
          sizes,
          imagesBase64: currentImagesBase64
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showAlert('¡Producto guardado exitosamente en Stock!', 'success');
        productForm.reset();
        currentImagesBase64 = [];
        const existingImgs = imagePreviewBox.querySelectorAll('img');
        existingImgs.forEach(img => img.remove());
        imagePlaceholder.style.display = 'block';
      } else {
        if (res.status === 401) {
          localStorage.removeItem('admin_token');
          showLogin();
        }
        showAlert(data.error || 'Error al guardar el producto', 'error');
      }
    } catch (err) {
      showAlert('Error de conexión al guardar', 'error');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });

  // --- LOAD & MANAGE STOCK PRODUCTS ---
  async function loadAdminProducts() {
    if (!adminProductList) return;
    adminProductList.innerHTML = '<p style="text-align: center; color: #888;">Cargando inventario...</p>';
    
    try {
      const res = await fetch(`https://raw.githubusercontent.com/tuttisports13-sys/puerto_hype/main/data/stock_products.json?t=${Date.now()}`);
      if (!res.ok) throw new Error('No se pudo descargar el inventario');
      
      loadedStockProducts = await res.json();
      renderAdminProducts(stockSearchInput ? stockSearchInput.value.toLowerCase().trim() : '');
    } catch (err) {
      console.error(err);
      adminProductList.innerHTML = '<p style="text-align: center; color: #ff5247;">Error al cargar productos de stock.</p>';
    }
  }

  function renderAdminProducts(filterQuery = '') {
    if (!adminProductList) return;

    const filtered = loadedStockProducts.filter(p => {
      if (!filterQuery) return true;
      return p.name.toLowerCase().includes(filterQuery);
    });

    if (filtered.length === 0) {
      adminProductList.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">No se encontraron productos en stock.</p>';
      return;
    }

    adminProductList.innerHTML = '';

    filtered.forEach(product => {
      const item = document.createElement('div');
      item.className = 'admin-product-item';
      
      let displayImg = product.image;
      if (!displayImg.startsWith('http')) {
        displayImg = `https://raw.githubusercontent.com/tuttisports13-sys/puerto_hype/main/${displayImg}`;
      }

      const sizesList = product.sizes || [];
      const sizesHtml = sizesList.map(s => `
        <span class="size-pill">
          ${s}
          <button type="button" class="btn-remove-size" data-id="${product.id}" data-size="${s}" title="Eliminar talla ${s}">✕</button>
        </span>
      `).join('');

      item.innerHTML = `
        <div class="admin-product-main">
          <img src="${displayImg}" alt="${product.name}" class="admin-product-img">
          <div class="admin-product-details">
            <h4>${product.name}</h4>
            <p class="product-price">$${product.price} MXN</p>
          </div>
        </div>

        <div class="sizes-container">
          <span class="sizes-label">Tallas:</span>
          ${sizesHtml.length > 0 ? sizesHtml : '<span style="color: #666; font-size: 0.75rem;">Sin tallas</span>'}
          <button type="button" class="btn-add-size" data-id="${product.id}">+ Agregar</button>
        </div>

        <button type="button" class="btn-delete-prod" data-id="${product.id}" data-name="${product.name}">
          🗑️ Eliminar Producto
        </button>
      `;

      adminProductList.appendChild(item);
    });

    // Add listeners for Delete Product
    adminProductList.querySelectorAll('.btn-delete-prod').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const name = e.currentTarget.getAttribute('data-name');
        if (confirm(`¿Estás SEGURO de que deseas eliminar permanentemente "${name}" del stock?`)) {
          await executeStockAction({ id, action: 'delete_product' }, e.currentTarget, 'Producto eliminado exitosamente');
        }
      });
    });

    // Add listeners for Remove Size
    adminProductList.querySelectorAll('.btn-remove-size').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const size = e.currentTarget.getAttribute('data-size');
        if (confirm(`¿Eliminar la talla "${size}" de este producto?`)) {
          await executeStockAction({ id, action: 'remove_size', size }, e.currentTarget, `Talla ${size} eliminada`);
        }
      });
    });

    // Add listeners for Add Size
    adminProductList.querySelectorAll('.btn-add-size').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const newSize = prompt('Ingresa la nueva talla para este producto (ej. 27 o 28 cm):');
        if (newSize && newSize.trim().length > 0) {
          await executeStockAction({ id, action: 'add_size', newSize: newSize.trim() }, e.currentTarget, `Talla ${newSize} agregada`);
        }
      });
    });
  }

  async function executeStockAction(payload, btnElement, successMsg) {
    const originalText = btnElement.textContent;
    btnElement.textContent = '...';
    btnElement.disabled = true;

    try {
      const res = await fetch('/api/delete-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: currentToken,
          ...payload
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showAlert(successMsg, 'success');
        // Refresh local cache and list
        setTimeout(() => loadAdminProducts(), 800);
      } else {
        if (res.status === 401) {
          localStorage.removeItem('admin_token');
          showLogin();
        }
        showAlert(data.error || 'Error al actualizar', 'error');
        btnElement.textContent = originalText;
        btnElement.disabled = false;
      }
    } catch (err) {
      showAlert('Error de conexión con el servidor', 'error');
      btnElement.textContent = originalText;
      btnElement.disabled = false;
    }
  }

  function showAdmin() {
    loginContainer.classList.add('hidden');
    adminContainer.classList.remove('hidden');
  }

  function showLogin() {
    adminContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
  }

  function showAlert(msg, type) {
    adminAlert.textContent = msg;
    adminAlert.className = `alert alert-${type}`;
    adminAlert.classList.remove('hidden');
    setTimeout(() => adminAlert.classList.add('hidden'), 3500);
  }
});
