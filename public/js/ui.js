// Devuelve true si el usuario está logueado
export function isLoggedIn() {
  return !!localStorage.getItem('user');
}

// Actualiza visibilidad de secciones según estado de sesión
export function updateUI() {
  const loginSection = document.querySelector('.login-section');
  const registerSection = document.querySelector('.register-section');
  const logoutSection = document.querySelector('.logout-section');

  const loggedIn = isLoggedIn();

  if (loginSection) loginSection.style.display = loggedIn ? 'none' : 'flex';
  if (registerSection) registerSection.style.display = loggedIn ? 'none' : 'flex';
  if (logoutSection) logoutSection.style.display = loggedIn ? 'flex' : 'none';
}
