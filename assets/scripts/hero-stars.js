document.addEventListener('DOMContentLoaded', function () {
  function initStars() {
    if (window.tsParticles && typeof tsParticles.load === 'function') {
      tsParticles.load('hero-stars', {
        fullScreen: { enable: false },
        fpsLimit: 60,
        particles: {
          number: { value: 520, density: { enable: true, area: 1600 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: { value: { min: 0.15, max: 0.9 }, animation: { enable: true, speed: 0.6, minimumValue: 0.15 } },
          size: { value: { min: 0.4, max: 2.2 }, random: true },
          move: { enable: true, speed: 0.2, direction: 'none', outModes: { default: 'out' } }
        },
        detectRetina: true,
        background: { color: 'transparent' }
      });
    } else {
      // If tsParticles is not loaded yet, retry shortly
      setTimeout(initStars, 250);
    }
  }

  initStars();
});
