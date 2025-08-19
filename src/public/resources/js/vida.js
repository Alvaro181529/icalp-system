document.addEventListener('DOMContentLoaded', function() {
    // Animación para los elementos
    const animateElements = (elements, animation) => {
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.animation = `${animation} 0.6s ease-out forwards ${index * 0.1}s`;
            }, 100);
        });
    };

    // Observador para activar animaciones al hacer scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('benefits-grid')) {
                    const benefits = entry.target.querySelectorAll('.benefit-item');
                    animateElements(benefits, 'fadeInUp');
                }
                else if (entry.target.classList.contains('events-list')) {
                    const events = entry.target.querySelectorAll('.event-item');
                    animateElements(events, 'fadeInUp');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Observar las secciones
    const sectionsToObserve = [
        document.querySelector('.benefits-grid'),
        document.querySelector('.events-list')
    ];

    sectionsToObserve.forEach(section => {
        if (section) observer.observe(section);
    });

    // Efecto hover para el botón CTA
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', () => {
            ctaButton.style.transform = 'translateY(-2px)';
        });
        
        ctaButton.addEventListener('mouseleave', () => {
            ctaButton.style.transform = 'translateY(0)';
        });
        
       
    }
});