// Menu Hamburguer
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Toggle menu mobile
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Impede que o clique se propague
      mobileMenu.classList.toggle('active');
      menuBtn.innerHTML = mobileMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
    });
    
    // Fecha menu ao clicar fora
    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('active');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
    
    // Fecha menu ao clicar em um link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
    
    // Scroll suave para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Fecha menu mobile se estiver aberto
          mobileMenu.classList.remove('active');
          menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
          
          // Scroll suave
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Botão Start Speaking
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        window.location.href = 'auth.html';
      });
    }
    
    // Botões Call Now
    document.querySelectorAll('.call-btn').forEach(button => {
      button.addEventListener('click', function() {
        const speakerName = this.closest('.speaker-card').querySelector('h3').textContent;
        alert(`Connecting you to ${speakerName}...\n(In a real app, this would start a video call)`);
        
        // Simulação de chamada
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        this.disabled = true;
        
        setTimeout(() => {
          this.innerHTML = '<i class="fas fa-phone-alt"></i> Call Now';
          this.disabled = false;
        }, 2000);
      });
    });
  });
  
  // Floating cards animation
  function animateFloatingCards() {
    const floating = document.querySelectorAll('.floating');
    if (floating.length === 0) return;
    
    floating.forEach((card, i) => {
      const randomY = Math.random() * 50 + 25;
      card.style.top = `${randomY}%`;
      if (i % 2 === 0) {
        card.style.left = '5%';
        card.style.right = '';
      } else {
        card.style.right = '5%';
        card.style.left = '';
      }
      
      // Adiciona animação se não existir
      if (!card.style.animation) {
        card.style.animation = 'float 3s ease-in-out infinite';
        card.style.animationDelay = `${i * 0.5}s`;
      }
    });
  }
  
  // Adiciona CSS para animação flutuante
  const floatStyle = document.createElement('style');
  floatStyle.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `;
  document.head.appendChild(floatStyle);
  
  // Inicializa quando DOM carrega
  document.addEventListener('DOMContentLoaded', () => {
    animateFloatingCards();
    
    // Animações de entrada
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    
    // Observa cards para animação
    document.querySelectorAll('.speaker-card, .feature-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(card);
    });
  });