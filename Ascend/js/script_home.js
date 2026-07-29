// Fade In Animation for Content Boxes and Gallery Images
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.classList.toggle('scroll-visible', entry.isIntersecting);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.scroll-left, .scroll-right, .map-section, .scroll-fade, .centerbutton, .image-side')
  .forEach(el => scrollObserver.observe(el));

// Auto-hide elements when offscreen
const overlayObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting && entry.target.dataset.autohide === "true") {
      entry.target.classList.remove('show-overlay');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.centerbutton[data-autohide="true"]')
  .forEach(el => overlayObserver.observe(el));

// Fade In Animation for Gallery Header
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});