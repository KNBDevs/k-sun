let slideIndex = 0;

export function nextSlide() {
  const slider = document.getElementById('slider');
  if (!slider) return;
  slideIndex = (slideIndex + 1) % 3;
  slider.style.transform = `translateX(-${slideIndex * 100}%)`;
}

export function prevSlide() {
  const slider = document.getElementById('slider');
  if (!slider) return;
  slideIndex = (slideIndex - 1 + 3) % 3;
  slider.style.transform = `translateX(-${slideIndex * 100}%)`;
}

export function setupSliderControls() {
  const scrollUpBtn = document.getElementById('scrollUpButton');
  if (scrollUpBtn) {
    window.addEventListener('scroll', () => {
      scrollUpBtn.classList.toggle('hidden', window.scrollY < 100);
    });
    scrollUpBtn.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }
}
