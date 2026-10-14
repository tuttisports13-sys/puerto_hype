// Puerto Hype - User Authentication & Orders Manager
// Manejo de cuentas de usuario, sesiones y registro de compras

const UserManager = (function() {
  const USERS_KEY = 'puerto_hype_users_db';
  const ACTIVE_USER_KEY = 'puerto_hype_active_user';
  const ORDERS_KEY = 'puerto_hype_orders_db';

  function _loadUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function _saveUsers(users) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving users:', e);
    }
  }

  function _loadOrders() {
    try {
      return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function _saveOrders(orders) {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders:', e);
    }
  }

  function getCurrentUser() {
    try {
      const data = localStorage.getItem(ACTIVE_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function registerUser(username, email, password) {
    const rawUsername = (username || '').trim();
    const cleanUsername = rawUsername.replace(/^@/, '').replace(/\s+/g, '_');
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, error: 'El nombre de usuario debe tener al menos 3 caracteres.' };
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(cleanUsername)) {
      return { success: false, error: 'El usuario solo puede contener letras, números, puntos o guiones bajos.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, error: 'Por favor ingresa un correo electrónico válido.' };
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      return { success: false, error: 'La contraseña debe tener mínimo 4 caracteres.' };
    }

    const users = _loadUsers();
    const usernameTaken = users.some(u => u.username.toLowerCase() === cleanUsername.toLowerCase());
    if (usernameTaken) {
      return { success: false, error: `El nombre de usuario @${cleanUsername} ya está ocupado. Elige otro.` };
    }
    const emailTaken = users.some(u => u.email.toLowerCase() === cleanEmail);
    if (emailTaken) {
      return { success: false, error: 'Este correo ya tiene una cuenta registrada. Intenta Iniciar Sesión.' };
    }

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      username: cleanUsername,
      email: cleanEmail,
      password: cleanPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    _saveUsers(users);

    const safeUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt
    };
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(safeUser));

    // Vincular pedidos huérfanos generados en esta sesión si existen
    const orders = _loadOrders();
    orders.forEach(o => {
      if (!o.userId || o.userId.startsWith('guest_')) {
        o.userId = safeUser.id;
        o.username = safeUser.username;
        o.email = safeUser.email;
      }
    });
    _saveOrders(orders);

    updateUserUI();
    return { success: true, user: safeUser };
  }

  function loginUser(identifier, password) {
    const cleanId = (identifier || '').trim().toLowerCase().replace(/^@/, '');
    const cleanPassword = (password || '').trim();

    if (!cleanId || !cleanPassword) {
      return { success: false, error: 'Por favor completa todos los campos.' };
    }

    const users = _loadUsers();
    const user = users.find(u => 
      u.username.toLowerCase() === cleanId || 
      u.email.toLowerCase() === cleanId
    );

    if (!user) {
      return { success: false, error: 'No encontramos ninguna cuenta con ese usuario o correo.' };
    }

    if (user.password !== cleanPassword) {
      return { success: false, error: 'Contraseña incorrecta. Inténtalo de nuevo.' };
    }

    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    };

    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(safeUser));
    updateUserUI();

    return { success: true, user: safeUser };
  }

  function logoutUser() {
    localStorage.removeItem(ACTIVE_USER_KEY);
    updateUserUI();
    return { success: true };
  }

  function saveOrder(orderData) {
    const user = getCurrentUser();
    const folio = '#PH-' + Math.floor(10000 + Math.random() * 90000);

    const newOrder = {
      id: 'ord_' + Date.now(),
      folio: folio,
      userId: user ? user.id : 'guest_' + Date.now(),
      username: user ? user.username : 'Invitado',
      email: user ? user.email : '',
      date: new Date().toISOString(),
      items: (orderData.items || []).map(item => ({
        name: item.name || 'Producto',
        size: item.size || (item.sizes && item.sizes[0]) || 'Única',
        quantity: item.quantity || 1,
        price: item.finalPrice || item.price || 0,
        isCustom: !!item.customization,
        customization: item.customization || null,
        image: item.image || ''
      })),
      totalPieces: orderData.totalPieces || (orderData.items || []).reduce((s, i) => s + (i.quantity || 1), 0),
      subtotal: orderData.subtotal || 0,
      total: orderData.total || 0,
      hasPreorderItems: !!orderData.hasPreorderItems,
      status: 'Registrado (Envío WhatsApp)',
      statusBadge: 'badge-registered'
    };

    const orders = _loadOrders();
    orders.unshift(newOrder);
    _saveOrders(orders);

    updateUserUI();
    return newOrder;
  }

  function getUserOrders(targetUserId) {
    const user = getCurrentUser();
    const uid = targetUserId || (user ? user.id : null);
    const orders = _loadOrders();

    if (!uid) {
      // Para invitados, retornar los pedidos más recientes sin usuario fijo
      return orders.filter(o => !o.userId || o.userId.startsWith('guest_'));
    }

    return orders.filter(o => o.userId === uid);
  }

  return {
    getCurrentUser,
    registerUser,
    loginUser,
    logoutUser,
    saveOrder,
    getUserOrders
  };
})();

window.UserManager = UserManager;

// UI Handlers & Interactivity
function handleAccountButtonClick() {
  const user = UserManager.getCurrentUser();
  if (user) {
    openAccountDrawer();
  } else {
    openAuthModal('login');
  }
}

function openAuthModal(initialTab = 'login') {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  switchAuthTab(initialTab);
  clearAuthAlert();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function switchAuthTab(tab) {
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const title = document.getElementById('auth-modal-title');
  const subtitle = document.querySelector('.auth-modal-subtitle');

  clearAuthAlert();

  if (tab === 'register') {
    if (tabLogin) tabLogin.classList.remove('active');
    if (tabRegister) tabRegister.classList.add('active');
    if (formLogin) formLogin.style.display = 'none';
    if (formRegister) formRegister.style.display = 'flex';
    if (title) title.textContent = 'CREAR TU CUENTA';
    if (subtitle) subtitle.textContent = 'Elige tu nombre de usuario y correo para guardar tu historial de compras.';
  } else {
    if (tabRegister) tabRegister.classList.remove('active');
    if (tabLogin) tabLogin.classList.add('active');
    if (formRegister) formRegister.style.display = 'none';
    if (formLogin) formLogin.style.display = 'flex';
    if (title) title.textContent = 'INICIAR SESIÓN';
    if (subtitle) subtitle.textContent = 'Accede a tus compras, rastrea tus pedidos y obtén beneficios exclusivos.';
  }
}

function showAuthAlert(message, type = 'error') {
  const alertEl = document.getElementById('auth-alert');
  if (!alertEl) return;
  alertEl.textContent = message;
  alertEl.className = 'auth-alert ' + (type === 'success' ? 'success' : 'error');
  alertEl.style.display = 'block';
}

function clearAuthAlert() {
  const alertEl = document.getElementById('auth-alert');
  if (!alertEl) return;
  alertEl.style.display = 'none';
  alertEl.textContent = '';
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const idInput = document.getElementById('login-identifier');
  const passInput = document.getElementById('login-password');
  if (!idInput || !passInput) return;

  const res = UserManager.loginUser(idInput.value, passInput.value);
  if (!res.success) {
    showAuthAlert(res.error, 'error');
  } else {
    showAuthAlert(`¡Bienvenido de vuelta, @${res.user.username}!`, 'success');
    setTimeout(() => {
      closeAuthModal();
      openAccountDrawer();
      if (typeof showToast === 'function') {
        showToast(`Sesión iniciada como @${res.user.username}`);
      }
    }, 400);
  }
}

function handleRegisterSubmit(event) {
  event.preventDefault();
  const userInput = document.getElementById('register-username');
  const emailInput = document.getElementById('register-email');
  const passInput = document.getElementById('register-password');
  if (!userInput || !emailInput || !passInput) return;

  const res = UserManager.registerUser(userInput.value, emailInput.value, passInput.value);
  if (!res.success) {
    showAuthAlert(res.error, 'error');
  } else {
    showAuthAlert(`¡Cuenta creada con éxito! Bienvenido @${res.user.username}`, 'success');
    setTimeout(() => {
      closeAuthModal();
      openAccountDrawer();
      if (typeof showToast === 'function') {
        showToast(`¡Cuenta creada! Bienvenido @${res.user.username}`);
      }
    }, 450);
  }
}

function openAccountDrawer() {
  const drawer = document.getElementById('account-drawer');
  const overlay = document.getElementById('account-overlay');
  if (!drawer || !overlay) return;

  renderAccountOrders();
  drawer.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAccountDrawer() {
  const drawer = document.getElementById('account-drawer');
  const overlay = document.getElementById('account-overlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function handleLogout() {
  if (confirm('¿Deseas cerrar tu sesión?')) {
    UserManager.logoutUser();
    closeAccountDrawer();
    if (typeof showToast === 'function') {
      showToast('Has cerrado sesión correctamente');
    }
  }
}

function updateUserUI() {
  const user = UserManager.getCurrentUser();
  const headerBtn = document.getElementById('btn-user-account');
  const headerLabel = document.getElementById('user-header-label');
  const avatar = document.getElementById('account-avatar');
  const usernameEl = document.getElementById('account-username');
  const emailEl = document.getElementById('account-email');

  if (user) {
    if (headerBtn) {
      headerBtn.classList.add('logged-in');
      headerBtn.title = `Mi Cuenta (@${user.username})`;
    }
    if (headerLabel) {
      headerLabel.textContent = `@${user.username}`;
      headerLabel.style.display = 'inline-block';
    }
    if (avatar) {
      avatar.textContent = user.username.substring(0, 2).toUpperCase();
    }
    if (usernameEl) {
      usernameEl.textContent = `@${user.username}`;
    }
    if (emailEl) {
      emailEl.textContent = user.email;
    }
  } else {
    if (headerBtn) {
      headerBtn.classList.remove('logged-in');
      headerBtn.title = 'Iniciar Sesión / Registro';
    }
    if (headerLabel) {
      headerLabel.textContent = '';
      headerLabel.style.display = 'none';
    }
    if (avatar) {
      avatar.textContent = 'PH';
    }
    if (usernameEl) {
      usernameEl.textContent = '@invitado';
    }
    if (emailEl) {
      emailEl.textContent = 'Inicia sesión para ver tu perfil';
    }
  }

  renderAccountOrders();
}

function renderAccountOrders() {
  const user = UserManager.getCurrentUser();
  const orders = UserManager.getUserOrders(user ? user.id : null);
  const container = document.getElementById('account-orders-list');
  const totalOrdersEl = document.getElementById('account-total-orders');
  const totalPiecesEl = document.getElementById('account-total-pieces');
  const countPill = document.getElementById('account-orders-count-pill');

  const totalPieces = orders.reduce((sum, o) => sum + (o.totalPieces || 0), 0);

  if (totalOrdersEl) totalOrdersEl.textContent = orders.length;
  if (totalPiecesEl) totalPiecesEl.textContent = totalPieces;
  if (countPill) countPill.textContent = `${orders.length} pedido${orders.length === 1 ? '' : 's'}`;

  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="orders-empty-state">
        <div class="empty-icon-box">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        </div>
        <h4>No tienes compras registradas aún</h4>
        <p>Agrega productos al carrito y haz tu pedido por WhatsApp para ver aquí tu historial y folio de seguimiento.</p>
        <button class="btn btn-primary" onclick="closeAccountDrawer(); window.resetView();" style="margin-top: 14px; font-size: 0.8rem; padding: 10px 18px;">
          EXPLORAR CATÁLOGO
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = orders.map(order => {
    const formattedDate = new Date(order.date).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const itemsHtml = (order.items || []).map(item => `
      <div class="order-item-row">
        <img src="${item.image || 'images/stock/IMG_2245.jpg'}" alt="${item.name}" class="order-item-thumb" onerror="this.src='https://images.unsplash.com/photo-1552346154-21d32810aba3?w=100'">
        <div class="order-item-details">
          <div class="order-item-title">${item.name}</div>
          <div class="order-item-meta">
            <span>Talla: <strong>${item.size}</strong></span>
            <span>Cant: <strong>${item.quantity}</strong></span>
            ${item.isCustom ? '<span style="color:var(--neon-lime)">• Personalizado</span>' : ''}
          </div>
        </div>
        <div class="order-item-price">
          ${item.price > 0 ? '$' + (item.price * item.quantity).toLocaleString() + ' MXN' : '<span style="color:var(--neon-lime)">Cotizado</span>'}
        </div>
      </div>
    `).join('');

    const totalDisplay = order.total > 0 
      ? `$${order.total.toLocaleString()} MXN` 
      : (order.hasPreorderItems ? 'Por Cotizar' : '$0 MXN');

    const whatsappMessage = encodeURIComponent(
      `Hola Puerto Hype! Quiero consultar el estatus de mi pedido *${order.folio}* realizado el ${formattedDate}. Nombre: @${order.username || 'Cliente'}.`
    );

    return `
      <div class="order-card">
        <div class="order-card-header">
          <div class="order-folio-wrap">
            <span class="order-folio">${order.folio}</span>
            <span class="order-date">${formattedDate}</span>
          </div>
          <span class="order-status-badge ${order.statusBadge || 'badge-registered'}">
            🟢 Registrado
          </span>
        </div>

        <div class="order-card-body">
          ${itemsHtml}
        </div>

        <div class="order-card-footer">
          <div class="order-total-info">
            <span class="order-total-label">Total (${order.totalPieces || 1} pzas):</span>
            <span class="order-total-val">${totalDisplay}</span>
          </div>
          <a href="https://wa.me/5212294135613?text=${whatsappMessage}" target="_blank" rel="noopener" class="btn-order-wa">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            Consultar Estatus
          </a>
        </div>
      </div>
    `;
  }).join('');
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
  updateUserUI();
});
