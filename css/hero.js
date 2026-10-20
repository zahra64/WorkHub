document.addEventListener('DOMContentLoaded', () => {

 
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      navLinks.forEach(l => l.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });

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