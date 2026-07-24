// === DOM элементы ===
const form = document.querySelector('.login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.querySelector('.btn-login');

// === Валидация формы ===
function validateForm() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const errors = [];

  // Проверка логина
  if (username.length < 3) {
    errors.push('Логин должен содержать минимум 3 символа');
    usernameInput.style.borderColor = '#e74c3c';
  } else {
    usernameInput.style.borderColor = '#ddd';
  }

  // Проверка пароля
  if (password.length < 6) {
    errors.push('Пароль должен содержать минимум 6 символов');
    passwordInput.style.borderColor = '#e74c3c';
  } else {
    passwordInput.style.borderColor = '#ddd';
  }

  return errors;
}

// === Показ сообщений ===
function showMessage(text, isError) {
  // Удаляем старое сообщение, если есть
  const oldMsg = document.querySelector('.form-message');
  if (oldMsg) oldMsg.remove();

  const msg = document.createElement('div');
  msg.className = 'form-message';
  msg.textContent = text;
  msg.style.cssText = isError
    ? 'color:#e74c3c; font-size:14px; margin-bottom:16px; text-align:center;'
    : 'color:#27ae60; font-size:14px; margin-bottom:16px; text-align:center;';

  form.insertBefore(msg, form.firstChild);
}

// === Обработка отправки формы ===
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const errors = validateForm();

  if (errors.length > 0) {
    showMessage(errors[0], true);
    return;
  }

  // Имитация запроса на сервер
  loginBtn.textContent = 'Вход...';
  loginBtn.disabled = true;

  setTimeout(function () {
    showMessage('Вход выполнен успешно! Перенаправление...', false);
    // Переход на страницу с live-событиями
    setTimeout(function () {
      window.location.href = 'dashboard.html';
    }, 1000);
  }, 1500);
});

// === Очистка подсветки при вводе ===
usernameInput.addEventListener('input', function () {
  this.style.borderColor = '#ddd';
  const msg = document.querySelector('.form-message');
  if (msg) msg.remove();
});

passwordInput.addEventListener('input', function () {
  this.style.borderColor = '#ddd';
  const msg = document.querySelector('.form-message');
  if (msg) msg.remove();
});

// === Показ/скрытие пароля по двойному клику ===
passwordInput.addEventListener('dblclick', function () {
  if (this.type === 'password') {
    this.type = 'text';
  } else {
    this.type = 'password';
  }
});
