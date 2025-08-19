document.addEventListener('DOMContentLoaded', function() {
    // Animación para las tarjetas
    const animateCards = () => {
        const cards = document.querySelectorAll('.funcion-card, .etapa-card, .documento-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        cards.forEach(card => {
            observer.observe(card);
        });
    };
    
    animateCards();
    
    // Efecto hover para los documentos
    const documentoCards = document.querySelectorAll('.documento-card');
    
    documentoCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('hover')) {
                card.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Aquí puedes agregar funcionalidad para descargar documentos
    documentoCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            // Simulación de descarga (en implementación real, esto sería un enlace real)
            const docTitle = this.querySelector('h3').textContent;
            alert(`En una implementación real, se descargaría el documento: ${docTitle}`);
        });
    });
});