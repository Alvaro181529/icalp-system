document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const derecha = document.querySelector('.derecha');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Crear overlay para el menú móvil
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);

    // Hover en links (solo desktop)
    if (window.innerWidth > 992) {
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.textShadow = '0 0 10px rgba(212, 175, 55, 0.5)';
                const arrow = this.querySelector('.dropdown-arrow');
                if (arrow) {
                    arrow.style.transform = 'rotate(180deg) scale(1.1)';
                }
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.textShadow = 'none';
                const arrow = this.querySelector('.dropdown-arrow');
                if (arrow) {
                    arrow.style.transform = 'rotate(0deg) scale(1)';
                }
            });
        });
    }

    // Scroll para oscurecer navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // Toggle menú hamburguesa
    hamburgerBtn.addEventListener('click', function() {
        derecha.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = derecha.classList.contains('active') ? 'hidden' : '';
    });

    // Cerrar menú al hacer clic en overlay
    overlay.addEventListener('click', function() {
        derecha.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Submenús para móviles
    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const submenu = item.querySelector('.submenu');
        
        if (submenu) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    submenu.classList.toggle('active');
                    
                    // Rotar flecha
                    const arrow = link.querySelector('.dropdown-arrow');
                    if (arrow) {
                        arrow.style.transform = submenu.classList.contains('active') 
                            ? 'rotate(180deg)' 
                            : 'rotate(0deg)';
                    }
                }
            });
        }
    });

    // Cerrar menú al cambiar tamaño de pantalla
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            derecha.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Ocultar todos los submenús en desktop
            document.querySelectorAll('.submenu').forEach(submenu => {
                submenu.classList.remove('active');
                submenu.style.display = '';
            });
        }
    });
});