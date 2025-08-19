document.addEventListener('DOMContentLoaded', function() {
   // Galería de imágenes para cada establecimiento
    const setupGalleries = () => {
        document.querySelectorAll('.gallery-container').forEach(gallery => {
            const mainImg = gallery.querySelector('.main-image img'); // Cambio aquí
            const thumbnails = gallery.querySelectorAll('.thumbnail');
            
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', function() {
                    // Remover clase active de todas las thumbnails
                    thumbnails.forEach(t => t.classList.remove('active'));
                    
                    // Añadir clase active a la thumbnail clickeada
                    this.classList.add('active');
                    
                    // Cambiar la imagen principal directamente
                    mainImg.src = this.src; // Cambio importante aquí
                });
            });
        });
    };
    
    
    // Animación al hacer scroll
    const animateOnScroll = () => {
        const establecimientoCards = document.querySelectorAll('.establecimiento-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.animation = `fadeInUp 0.8s ease-out forwards ${index * 0.2}s`;
                    }, 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        establecimientoCards.forEach(card => {
            observer.observe(card);
        });
    };
    
    // Inicializar todas las funciones
    setupGalleries();
       animateOnScroll();
    setupReservaButtons();
    
    // Precargar imágenes para evitar flashes al cambiar
    window.addEventListener('load', function() {
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            const img = new Image();
            img.src = thumb.src;
        });

    });
});