// Maneja el despliegue del nav en moviles
const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");

// Controla el despliegue del nav y menu en movil
document.addEventListener('DOMContentLoaded', () => {
    const abrirMenu = document.querySelector('.abrir_menu');
    const cerrarMenu = document.querySelector('#cerrar');
    const navMenus = [document.querySelector('#nav'), document.querySelector('#menu_nav')]; // Selecciona ambos IDs

    // Función para abrir el menú
    abrirMenu.addEventListener('click', () => {
        navMenus.forEach(navMenu => {
            if (navMenu) {
                navMenu.classList.add('visible');
            }
        });
    });

    // Función para cerrar el menú
    cerrarMenu.addEventListener('click', () => {
        navMenus.forEach(navMenu => {
            if (navMenu) {
                navMenu.classList.remove('visible');
            }
        });
    });

    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener('click', (event) => {
        navMenus.forEach(navMenu => {
            if (navMenu && !navMenu.contains(event.target) && !abrirMenu.contains(event.target)) {
                navMenu.classList.remove('visible');
            }
        });
    });
});

// Controla las opciones de filtrado
document.addEventListener('DOMContentLoaded', () => {
    const filterButton = document.querySelector('.filter-button');
    const filterOptions = document.querySelector('.filter-options');

    filterButton.addEventListener('click', () => {
        if (filterOptions.classList.contains('visible')) {
            filterOptions.classList.remove('visible');
            filterOptions.classList.add('hidden');
            setTimeout(() => {
                filterOptions.style.display = 'none'; // Ocultar después de la animación
            }, 300); // Duración de la animación
        } else {
            filterOptions.style.display = 'flex'; // Mostrar antes de la animación
            setTimeout(() => {
                filterOptions.classList.remove('hidden');
                filterOptions.classList.add('visible');
            }, 10); // Pequeño retraso para permitir que la animación se active
        }
    });

    // Cerrar el menú del filtro al hacer clic fuera de él
    document.addEventListener('click', (event) => {
        if (!filterOptions.contains(event.target) && !filterButton.contains(event.target)) {
            if (filterOptions.classList.contains('visible')) {
                filterOptions.classList.remove('visible');
                filterOptions.classList.add('hidden');
                setTimeout(() => {
                    filterOptions.style.display = 'none'; // Ocultar después de la animación
                }, 300); // Duración de la animación
            }
        }
    });
});


// Añadir efecto de hover a las tarjetas
document.querySelectorAll('.flor-card').forEach(card => {
    card.addEventListener('mouseover', () => {
        card.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
    });
    
    card.addEventListener('mouseout', () => {
        card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    });
});

// Maneja el boton de filtrado
document.addEventListener('DOMContentLoaded', () => {
    const filterButton = document.getElementById('filter-button');
    const filterOptions = document.getElementById('filter-options');

    // Mostrar/ocultar opciones de filtro
    filterButton.addEventListener('click', () => {
        filterOptions.classList.toggle('hidden');
    });
});

// Función para manejar los filtros
function filterBy(criteria) {
    console.log(`Filtrando por: ${criteria}`);
    // Aquí puedes implementar la lógica para filtrar los productos
}


document.querySelectorAll('.masContenido').forEach(card => {
    card.addEventListener('mouseover', () => {
        card.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
    });
    
    card.addEventListener('mouseout', () => {
        card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    });
});

//Animacion para el slider
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.sliderInner');
    const slides = document.querySelectorAll('.imgSlide');
    let slideWidth = slides[0].clientWidth; // Ancho de una imagen
    let currentIndex = 0;
    const slideInterval = 5000; // Intervalo de 5 segundos

    function updateSliderPosition() {
        slider.style.transition = 'transform 0.5s ease-in-out';
        slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    function updateSlideWidth() {
        slideWidth = slides[0].clientWidth; // Ancho de una imagen
        updateSliderPosition();
    }

    function nextSlide() {
        currentIndex += 1;
        updateSliderPosition();

        if (currentIndex >= slides.length / 1) {
            setTimeout(() => {
                slider.style.transition = 'none';
                currentIndex = 0;
                updateSliderPosition();
            }, 500); // Tiempo de la transición
        }
    }

    window.addEventListener('resize', updateSlideWidth);
    updateSlideWidth(); // Inicializar el ancho del slide

    // Configurar el intervalo para cambiar las imágenes automáticamente
    setInterval(nextSlide, slideInterval);
});

// Animación para los botones de comprar
document.querySelectorAll('.btn-comprar' , '.masContenido').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 100);

        //Verifica si el enlace o botón tiene el atributo data-alert="true" en la etiqueta
        if (btn.getAttribute('data-alert') === 'true'){
            alert('¡Gracias por tu interés! Esta función estará disponible pronto en su version final.');
        }
        else{
            btn.addEventListener
        }
    });
});

// Función para manejar el cambio de tamaño de pantalla
function handleResize() {
    const width = window.innerWidth;

    if (width <= 768) {
        // Ajustes para pantallas pequeñas
        document.querySelector('nav').classList.remove('active');
    } else if (width > 768 && width <= 1024) {
        // Ajustes para pantallas medianas
        document.querySelector('nav').classList.add('active');
    } else if (width > 1024 && width <= 1440) {
        // Ajustes para pantallas grandes
        document.querySelector('nav').classList.add('active');
    } else {
        // Ajustes para pantallas extra grandes
        document.querySelector('nav').classList.add('active');
    }
}

// Escuchar el evento de cambio de tamaño de la ventana
window.addEventListener('resize', handleResize);

// Llamar a la función al cargar la página
handleResize();


//Ruta de direccion a la pagina de incio por medio del logo
document.getElementById('logo').addEventListener('click', function() {
    window.location.href = 'index.html'; // o la ruta de tu página inicial
});

document.getElementById("preview-btn").addEventListener("click", async () => {
    // Obtener los valores seleccionados del formulario
    const flowerId = document.getElementById("flower-type").value;
    const flowerColor = document.getElementById("flower-color").value;
    const wrapId = document.getElementById("wrap-design").value;
    const wrapColor = document.getElementById("wrap-color").value;

});

// Hara scroll en las tarjetas de la galeria
document.addEventListener('DOMContentLoaded', function() {
    const catalogoGrid = document.querySelector('.catalogo-grid');

    catalogoGrid.addEventListener('mouseenter', function() {
        document.body.style.overflowY = 'hidden'; // Bloquear el desplazamiento vertical de la página
    });

    catalogoGrid.addEventListener('mouseleave', function() {
        document.body.style.overflowY = 'auto'; // Desbloquear el desplazamiento vertical de la página
    });

    catalogoGrid.addEventListener('wheel', function(event) {
        if (event.deltaY !== 0) {
            event.preventDefault();
            catalogoGrid.scrollLeft += event.deltaY;
        }
    });

    // Manejar el desplazamiento táctil en dispositivos móviles y tabletas
    let isDown = false;
    let startX;
    let scrollLeft;

    catalogoGrid.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - catalogoGrid.offsetLeft;
        scrollLeft = catalogoGrid.scrollLeft;
    });

    catalogoGrid.addEventListener('touchend', () => {
        isDown = false;
    });

    catalogoGrid.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - catalogoGrid.offsetLeft;
        const walk = (x - startX) * 3; // Ajusta la velocidad del desplazamiento
        catalogoGrid.scrollLeft = scrollLeft - walk;
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const floresGrid = document.querySelector('.flores-grid');

    floresGrid.addEventListener('mouseenter', function() {
        document.body.style.overflowY = 'hidden'; // Bloquear el desplazamiento vertical de la página
    });

    floresGrid.addEventListener('mouseleave', function() {
        document.body.style.overflowY = 'auto'; // Desbloquear el desplazamiento vertical de la página
    });

    floresGrid.addEventListener('wheel', function(event) {
        if (event.deltaY !== 0) {
            event.preventDefault();
            floresGrid.scrollLeft += event.deltaY;
        }
    });
});


// fltro de busqueda en catalogo
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.producto-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');

            // Filter product cards
            productCards.forEach(card => {
                if (filter === 'todos' || card.getAttribute('data-categoria') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});



