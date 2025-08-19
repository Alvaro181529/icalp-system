document.addEventListener('DOMContentLoaded', function() {
    // Inicializar modal del mapa
    const modal = document.getElementById('mapaModal');
    const modalTitle = document.getElementById('modal-title');
    const modalInfo = document.getElementById('modal-info');
    const closeModal = document.querySelector('.close-modal');
    const verMapaBtns = document.querySelectorAll('.ver-mapa-btn');
    
    // Abrir modal al hacer clic en "Ver en Mapa"
    verMapaBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const location = this.getAttribute('data-location');
            modalTitle.textContent = this.parentElement.parentElement.querySelector('h3').textContent;
            
            // Aquí puedes añadir la información adicional que quieras mostrar
            const infoHTML = `
                <p><i class="fas fa-map-marker-alt"></i> <strong>Dirección:</strong> ${this.parentElement.querySelector('p').textContent.replace('Dirección:', '').trim()}</p>
                ${this.parentElement.querySelectorAll('p').length > 1 ? 
                 `<p><i class="fas fa-clock"></i> <strong>Horario:</strong> ${this.parentElement.querySelectorAll('p')[1].textContent.replace('Horario de Atención:', '').trim()}</p>` : ''}
            `;
            
            modalInfo.innerHTML = infoHTML;
            modal.style.display = 'block';
            
            // Inicializar mapa (aquí deberías integrar tu API de mapas preferida)
            initMap(location);
        });
    });
    
    // Cerrar modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Cerrar al hacer clic fuera del modal
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Función para inicializar el mapa (ejemplo con Google Maps)
    function initMap(location) {
        // Esta es una implementación simulada
        // En producción, reemplaza con tu API de mapas real (Google Maps, Mapbox, etc.)
        const mapContainer = document.getElementById('map');
        
        // Mensaje temporal (en implementación real esto sería el mapa)
        mapContainer.innerHTML = `
            <div style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:20px;">
                <i class="fas fa-map-marked-alt" style="font-size:3em; color:#f1c40f; margin-bottom:20px;"></i>
                <h3 style="color:#2c3e50;">Mapa Interactivo</h3>
                <p style="margin-top:10px;">Ubicación: ${location}</p>
                <p style="margin-top:20px; color:#7f8c8d;"><small>En una implementación real aquí se mostraría el mapa con la ubicación exacta.</small></p>
            </div>
        `;
        
        /* 
        // Código de ejemplo para Google Maps (descomenta y configura con tu API key)
        const map = new google.maps.Map(mapContainer, {
            zoom: 15,
            center: {lat: -16.4897, lng: -68.1193}, // Coordenadas de La Paz
            mapTypeId: 'roadmap'
        });
        
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': location}, function(results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
                new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            } else {
                alert('No se pudo encontrar la ubicación: ' + status);
            }
        });
        */
    }
    
    // Animaciones para las tarjetas
    const animateCards = () => {
        const cards = document.querySelectorAll('.institucion-card, .acceso-card');
        
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
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    };
    
    animateCards();
});