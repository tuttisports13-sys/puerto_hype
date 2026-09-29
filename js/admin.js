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
  
  let currentToken = localStorage.getItem('admin_token');
  let currentImagesBase64 = []; // Array of base64 strings

  if (currentToken) {
    showAdmin();
  }

  // --- LOGIN ---
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-login');
    const originalText = btn.textContent;
    btn.innerHTML = '<span class="loader"></span>';
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
        loginAlert.textContent = data.error || 'Error al iniciar sesión';
        loginAlert.classList.remove('hidden');
      }
    } catch (err) {
      loginAlert.textContent = 'Error de conexión';
      loginAlert.classList.remove('hidden');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });

  // --- IMAGE UPLOAD PREVIEW ---
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

  // --- ADD PRODUCT ---
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (currentImagesBase64.length === 0) {
      showAlert('Por favor, selecciona al menos una foto.', 'error');
      return;
    }

    const btn = document.getElementById('btn-save');
    const originalText = btn.textContent;
    btn.innerHTML = '<span class="loader"></span> Guardando...';
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
        showAlert('¡Producto guardado exitosamente!', 'success');
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
        showAlert(data.error || 'Error al guardar', 'error');
      }
    } catch (err) {
      showAlert('Error de conexión', 'error');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });

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
    if (type === 'success') {
      setTimeout(() => adminAlert.classList.add('hidden'), 3000);
    }
  }
});


  async function loadAdminProducts() {
    const listContainer = document.getElementById('admin-product-list');
    if (!listContainer) return;
    
    try {
      const res = await fetch(`https://raw.githubusercontent.com/tuttisports13-sys/puerto_hype/main/data/stock_products.json?t=${Date.now()}`);
      if (!res.ok) throw new Error('No se pudo cargar el inventario');
      
      const products = await res.json();
      
      if (products.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: #999;">No hay productos en inventario.</p>';
        return;
      }
      
      listContainer.innerHTML = '';
      
      products.forEach(product => {
        const item = document.createElement('div');
        item.className = 'admin-product-item';
        
        let displayImg = product.image;
        if (!displayImg.startsWith('http')) {
            displayImg = `https://raw.githubusercontent.com/tuttisports13-sys/puerto_hype/main/${displayImg}`;
        }
        
        item.innerHTML = `
          <div class="admin-product-info">
            <img src="${displayImg}" alt="${product.name}" class="admin-product-img">
            <div class="admin-product-details">
              <h4>${product.name}</h4>
              <p>$${product.price} MXN</p>
            </div>
          </div>
          <button class="btn-delete" data-id="${product.id}">Eliminar</button>
        `;
        listContainer.appendChild(item);
      });
      
      // Add delete events
      document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const productId = e.target.getAttribute('data-id');
          if (confirm('¿Estás SEGURO de que deseas eliminar este producto permanentemente?')) {
            await deleteProduct(productId, e.target);
          }
        });
      });
      
    } catch (err) {
      listContainer.innerHTML = '<p style="text-align: center; color: red;">Error al cargar productos.</p>';
    }
  }

  async function deleteProduct(id, btnElement) {
    const token = localStorage.getItem('adminToken');
    btnElement.textContent = 'Borrando...';
    btnElement.disabled = true;
    
    try {
      const res = await fetch('/api/delete-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, id })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        showAlert('Producto eliminado exitosamente', 'success');
        loadAdminProducts(); // Reload list
      } else {
        showAlert(data.error || 'Error al eliminar', 'error');
        btnElement.textContent = 'Eliminar';
        btnElement.disabled = false;
      }
    } catch (err) {
      showAlert('Error de conexión al eliminar', 'error');
      btnElement.textContent = 'Eliminar';
      btnElement.disabled = false;
    }
  }
