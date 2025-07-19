export function setupAuth({ onLoginSuccess, onLogout }) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const logoutButton = document.getElementById('logoutButton');

  const updateUI = () => {
    const loginSection = document.querySelector('.login-section');
    const registerSection = document.querySelector('.register-section');
    const logoutSection = document.querySelector('.logout-section');

    const loggedIn = !!localStorage.getItem('user');

    if (loginSection) loginSection.style.display = loggedIn ? 'none' : 'flex';
    if (registerSection) registerSection.style.display = loggedIn ? 'none' : 'flex';
    if (logoutSection) logoutSection.style.display = loggedIn ? 'flex' : 'none';
  };

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = loginForm.querySelector('[name="loginEmail"]');
      const passwordInput = loginForm.querySelector('[name="loginPassword"]');
      const remember = loginForm.rememberLogin?.checked || false;

      if (!emailInput || !passwordInput) return;

      const email = emailInput.value;
      const password = passwordInput.value;

      try {
        const response = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ loginEmail: email, loginPassword: password }),
          credentials: 'include'
        });

        const result = await response.json();

        if (response.ok) {
          Swal.fire({ icon: 'success', title: 'Éxito', text: 'Login exitoso', confirmButtonColor: '#6D9A2B' });
          localStorage.setItem('user', email);
          if (remember) localStorage.setItem('remember', true);
          updateUI();
          if (onLoginSuccess) onLoginSuccess(result.rewards);
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: result.message || 'Error al iniciar sesión', confirmButtonColor: '#6D9A2B' });
        }
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al iniciar sesión', confirmButtonColor: '#6D9A2B' });
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const name = document.getElementById('name')?.value;
      const email = document.getElementById('email')?.value;
      const password = document.getElementById('password')?.value;
      const confirmPassword = document.getElementById('confirmPassword')?.value;
      const remember = registerForm.rememberRegister?.checked || false;

      if (!name || !email || !password || !confirmPassword) return;

      if (password !== confirmPassword) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Las contraseñas no coinciden.', confirmButtonColor: '#6D9A2B' });
        return;
      }

      if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password)) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'La contraseña debe tener al menos 8 caracteres, incluir un número y una mayúscula.', confirmButtonColor: '#6D9A2B' });
        return;
      }

      try {
        const response = await fetch('/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const result = await response.text();

        if (response.ok) {
          Swal.fire({ icon: 'success', title: 'Éxito', text: 'Registro exitoso, verifica tu email.', confirmButtonColor: '#6D9A2B' });
          localStorage.setItem('user', email);
          if (remember) localStorage.setItem('remember', true);
          updateUI();
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: result, confirmButtonColor: '#6D9A2B' });
        }
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al registrar el usuario', confirmButtonColor: '#6D9A2B' });
      }
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('user');
      localStorage.removeItem('remember');
      updateUI();
      if (onLogout) onLogout();
    });
  }

  updateUI(); // Ejecutar al cargar
}
