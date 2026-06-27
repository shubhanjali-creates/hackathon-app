// Navbar scroll effect
const navbar = document.querySelector('.navbar-app');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });
}

// Active nav link
document.querySelectorAll('.navbar-app .nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === window.location.pathname) {
    link.classList.add('active');
  }
});

// Mobile sidebar toggle
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
} else if (sidebarToggle) {
  sidebarToggle.style.display = 'none';
}

// Close modal on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && typeof toggleModal === 'function') {
    const modal = document.getElementById('postModal');
    if (modal && modal.classList.contains('active')) {
      toggleModal();
    }
  }
});

// Live countdown for food/cab post lifespans
function formatCountdown(ms) {
  if (ms <= 0) return null;
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m ${s}s left`;
  if (m > 0) return `${m}m ${s}s left`;
  return `${s}s left`;
}

function initCountdowns() {
  const badges = document.querySelectorAll('[data-expires-at]');
  if (!badges.length) return;

  function tick() {
    badges.forEach((badge) => {
      const textEl = badge.querySelector('.countdown-text') || badge;
      const expires = new Date(badge.dataset.expiresAt);
      const diff = expires - Date.now();
      if (diff <= 0) {
        textEl.textContent = 'Expired';
        badge.classList.add('countdown-expired');
        return;
      }
      const formatted = formatCountdown(diff);
      textEl.textContent = formatted || 'Expired';
      badge.classList.remove('countdown-expired');
    });
  }

  tick();
  setInterval(tick, 1000);
}

document.addEventListener('DOMContentLoaded', initCountdowns);
