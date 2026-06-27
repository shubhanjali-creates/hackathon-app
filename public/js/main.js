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
