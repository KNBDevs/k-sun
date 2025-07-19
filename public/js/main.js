import { setupAuth } from './auth.js';
import { loadRewardsIfLoggedIn } from './rewards.js';
import { setupMastermindForm } from './mastermind.js';
import { updateUI, isLoggedIn } from './ui.js';
import { setupSliderControls } from './slider.js';


document.addEventListener('DOMContentLoaded', async () => {
  console.log('Document loaded');

  // Inicialización de módulos
  setupAuth({
    onLoginSuccess: loadRewardsIfLoggedIn,
    onLogout: updateUI
  });

  setupMastermindForm();
  updateUI();
  setupSliderControls();

  // Cargar recompensas si está logueado
  if (isLoggedIn()) {
    await loadRewardsIfLoggedIn();
  }

  // Scroll-Up button
  const scrollUpButton = document.getElementById('scrollUpButton');
  window.addEventListener('scroll', () => {
    scrollUpButton.style.display = window.scrollY > 100 ? 'block' : 'none';
  });

  scrollUpButton?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Responsive navbar
  const navLinks = document.querySelector('.nav-links');
  const menuToggle = document.getElementById('mobile-menu-toggle');
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 769) {
      navLinks?.classList.remove('active');
      menuToggle?.classList.remove('toggle');
    }
  });
});
