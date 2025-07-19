// public/js/objetivo.js
import { nextSlide, prevSlide, setupSliderControls } from './slider.js';

document.addEventListener('DOMContentLoaded', () => {
  // Asociar botones si existen
  const nextBtn = document.getElementById('nextSlideBtn');
  const prevBtn = document.getElementById('prevSlideBtn');

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
  }

  // Activar scroll up
  setupSliderControls();
});
