document.addEventListener('DOMContentLoaded', () => {

  // كود الـ Navbar الخاص بزميلك
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      navLinks.forEach(l => l.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });

  // كود الـ Hero الخاص بك (التمرير السلس عند الضغط على زر "Se alla upplevelser")
  const heroBtn = document.getElementById('hero-cta-btn');
  
  if (heroBtn) {
    heroBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('.four-ways');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

});