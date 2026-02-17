// SCROLL-ANIMATIONEN

const maxScroll = 1;       // Scroll-Strecke in Pixel
const maxHeight = 5;       // rem
const minHeight = 3;       // rem
const startDeg  = -3;      // deg
const endDeg    = 0;       // deg
const rotationSmoothing = 0.1;

document.addEventListener('DOMContentLoaded', () => {
  const logo = document.getElementById('Logo');
  if (!logo) return;

  let currentDeg = startDeg;
  let targetDeg = startDeg;

  function updateTargets() {
    const t = Math.min((window.scrollY || 0) / maxScroll, 1);

    // Höhe direkt setzen, CSS-Transition sorgt für Smooth
    const newHeight = maxHeight - (maxHeight - minHeight) * t;
    logo.style.height = newHeight + 'rem';

    // Rotation Zielwert
    targetDeg = startDeg + (endDeg - startDeg) * t;
  }

  function animateRotation() {
    currentDeg += (targetDeg - currentDeg) * rotationSmoothing;
    logo.style.transform = `rotate(${currentDeg}deg)`;
    requestAnimationFrame(animateRotation);
  }

  window.addEventListener('scroll', updateTargets, { passive: true });
  updateTargets();
  animateRotation();
});

// NAVIGATIONS MODAL

const navBtn = document.getElementById('navMenuBtn');
const menu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlay');
const iconWrapper = document.getElementById('menuIconWrapper');
const modalLinks = menu.querySelectorAll('a');

function setMenuState(isOpen) {
  menu.classList.toggle('show', isOpen);
  overlay.classList.toggle('show', isOpen);
  navBtn.textContent = isOpen ? 'close' : 'menu';
  iconWrapper.classList.toggle('activeMenu', isOpen);
  navBtn.style.color = isOpen ? 'var(--neutral-0)' : 'initial';
  document.body.classList.toggle('no-scroll', isOpen);

  if (isOpen && modalLinks.length > 0) {
    modalLinks[0].focus();
  }
  if (!isOpen) {
    navBtn.focus();
  }
}

function toggleMenu() {
  const isOpen = !menu.classList.contains('show');
  setMenuState(isOpen);
}

// Links im Modal schließen das Menü
modalLinks.forEach(link => {
  // Klick
  link.addEventListener('click', () => setMenuState(false));

  // Enter oder Space
  link.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setMenuState(false);
      // optional: Navigation trotzdem ausführen
      link.click();
    }
  });
});

// Button: Klick und Tastatur
navBtn.addEventListener('click', toggleMenu);
navBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleMenu();
  }
});

// Overlay schließt das Menü
overlay.addEventListener('click', () => setMenuState(false));

// Esc schließt das Menü
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('show')) {
    setMenuState(false);
  }
});

// Focus Trap
document.addEventListener('keydown', (e) => {
  if (!menu.classList.contains('show')) return;
  if (e.key !== 'Tab') return;

  const focusable = menu.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length === 0) return;

  const firstEl = focusable[0];
  const lastEl = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstEl) {
      e.preventDefault();
      lastEl.focus();
    }
  } else {
    if (document.activeElement === lastEl) {
      e.preventDefault();
      firstEl.focus();
    }
  }
});

