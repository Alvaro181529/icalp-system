
        document.addEventListener('DOMContentLoaded', function() {
            let indiceDiapositivaActual = 0;
            const diapositivas = document.querySelectorAll('.diapositiva-carrusel');
            const envoltorio = document.getElementById('envoltorioCarrusel');
            const totalDiapositivas = diapositivas.length;
            let intervaloReproduccion;
            const intervalo = 3000; 

            function cambiarDiapositiva() {
                indiceDiapositivaActual = (indiceDiapositivaActual + 1) % totalDiapositivas;
                actualizarCarrusel();
                reiniciarAnimaciones();
            }

            function actualizarCarrusel() {
                const translateX = -indiceDiapositivaActual * (100 / totalDiapositivas);
                envoltorio.style.transform = `translateX(${translateX}%)`;
            }

            function reiniciarAnimaciones() {
                // Reinicia las animaciones de texto para cada slide
                const textosActuales = diapositivas[indiceDiapositivaActual].querySelectorAll('.texto, .boton-admision');
                textosActuales.forEach(elemento => {
                    elemento.style.animation = 'none';
                    // Forzar reflow
                    void elemento.offsetWidth;
                    elemento.style.animation = null;
                });
            }

            function iniciarReproduccionAutomatica() {
                detenerReproduccionAutomatica();
                intervaloReproduccion = setInterval(cambiarDiapositiva, intervalo);
            }

            function detenerReproduccionAutomatica() {
                if (intervaloReproduccion) {
                    clearInterval(intervaloReproduccion);
                }
            }

          

            // Iniciar el carrusel
            actualizarCarrusel();
            iniciarReproduccionAutomatica();
            reiniciarAnimaciones();

            // Opcional: Detectar cuando la pestaña no está visible para pausar el slider
            document.addEventListener('visibilitychange', function() {
                if (document.hidden) {
                    detenerReproduccionAutomatica();
                } else {
                    iniciarReproduccionAutomatica();
                }
            });
            //BUSCAR MATRICULADOS OCULTO
              
// BUSCAR MATRICULADOS
document.getElementById('btnBuscar').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('buscadorColegiados').classList.toggle('oculto');
    document.getElementById('formDenuncia').classList.add('oculto'); // Cierra denuncia si está abierta
});

// FORMULARIO DE DENUNCIA
document.getElementById('btnDenunciar').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('formDenuncia').classList.toggle('oculto');
    document.getElementById('buscadorColegiados').classList.add('oculto'); // Cierra buscador si está abierto
});

//popup resultados
document.getElementById("btnEnviarBusqueda").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("popupResultados").style.display = "block";
});

document.getElementById("cerrarPopup").addEventListener("click", function() {
    document.getElementById("popupResultados").style.display = "none";
});

window.addEventListener("click", function(event) {
    if (event.target == document.getElementById("popupResultados")) {
        document.getElementById("popupResultados").style.display = "none";
    }
});

// JS de validación y popup
document.getElementById("denunciaForm").addEventListener("submit", function(e) {
    e.preventDefault();
    let valido = true;

    // Quitar errores previos
    document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));

    // Revisar campos
    this.querySelectorAll("[required]").forEach(campo => {
        if (!campo.value.trim()) {
            campo.classList.add("input-error");
            valido = false;
        }
    });

    if (valido) {
        // Mostrar popup
        document.getElementById("popupDenuncia").classList.remove("oculto");
        // Limpiar formulario
        this.reset();
    }
});

// Cerrar popup
document.getElementById("cerrarPopup2").addEventListener("click", function() {
    document.getElementById("popupDenuncia").classList.add("oculto");
});




  
        });

