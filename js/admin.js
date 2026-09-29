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

  fileInput.addEventListener('change', () => {
    const files = Array.from(fileInput.files);
    if (files.length > 0) {
      currentImagesBase64 = [];
      // Remove all current images inside the box except the placeholder
      const existingImgs = imagePreviewBox.querySelectorAll('img');
      existingImgs.forEach(img => img.remove());
      
      imagePlaceholder.style.display = 'none';

      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          currentImagesBase64.push(e.target.result);
          const img = document.createElement('img');
          img.src = e.target.result;
          imagePreviewBox.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    } else {
      // If user canceled selection
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
