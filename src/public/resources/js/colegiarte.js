document.addEventListener('DOMContentLoaded', function() {
    // Animación para las tarjetas de beneficios
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    function animateCards() {
        benefitCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = `fadeInUp 0.5s ease-out forwards ${index * 0.2}s`;
            }, 100);
        });
    }
    
    // Intersection Observer para activar animaciones cuando se ven
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCards();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(document.querySelector('.benefits-section'));
    
    // Efecto hover para el botón CTA
    const ctaButton = document.querySelector('.cta-button');
    
    ctaButton.addEventListener('mouseenter', () => {
        ctaButton.style.transform = 'translateY(-2px)';
    });
    
    ctaButton.addEventListener('mouseleave', () => {
        ctaButton.style.transform = 'translateY(0)';
    });
    
   
});