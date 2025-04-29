// SwiperSlide de flores
var swiper = new Swiper(".swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    initialSlide: 3,
    speed: 600,
    preventClicks: true,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 0,
        stretch: 80,
        depth: 350,
        modifier: 1,
        slideShadows: true,
    },
    on: {
        click(event) {
            swiper.slideTo(this.clickedIndex);
        },
    },
    pagination: {
        el: ".swiper-pagination",
    },
});

/* ---- particles.js config ---- */

particlesJS("particles-js", {
    "particles": {
      "number": {
        "value": 160,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": ("#FC8EAC", "#fc8ec1", "#ffe3f0")
      },
      "shape": {
        "type": "circle",
      },
      "opacity": {
        "value": 0.6,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 10,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 5,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 5,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": false,
      },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "none",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "retina_detect": true
  });
  
  

// Script para el funcionamiento de la animacion del login y el registro
const container = document.getElementById('container-login');
const login = document.getElementById('login');
const register = document.getElementById('register');

register.addEventListener('click', () => {
    container.classList.add("active");
});

login.addEventListener('click', () => {
    container.classList.remove("active");
});


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

// SwiperSlide de flores
var swiper = new Swiper(".swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    initialSlide: 3,
    speed: 600,
    preventClicks: true,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 0,
        stretch: 80,
        depth: 350,
        modifier: 1,
        slideShadows: true,
    },
    on: {
        click(event) {
            swiper.slideTo(this.clickedIndex);
        },
    },
    pagination: {
        el: ".swiper-pagination",
    },
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

// Obtener el parámetro "status" de la URL
const params = new URLSearchParams(window.location.search);
const status = params.get('status');

// Mostrar un mensaje basado en el estado del pago
const statusMessage = document.getElementById('status-message');
if (status === 'approved') {
    statusMessage.textContent = '¡Pago aprobado! Gracias por tu compra.';
} else if (status === 'declined') {
    statusMessage.textContent = 'Lo sentimos, tu pago fue rechazado.';
} else {
    statusMessage.textContent = 'Hubo un problema con tu pago. Por favor, intenta nuevamente.';
}


// Procesar parámetros de URL para mostrar el estado
// Procesar parámetros de URL
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const mainElement = document.getElementById('confirmationMain');
    const paymentStatus = document.getElementById('payment-status');
    const checkmark = document.querySelector('.checkmark');
    
    if(status === 'approved') {
        mainElement.classList.add('success');
        paymentStatus.textContent = '¡Tu pago fue exitoso! En breve recibirás un correo con los detalles de tu compra.';
        
        // Vaciar carrito
        fetch('/api/cart', { method: 'DELETE' });
    } else {
        mainElement.classList.add('error');
        paymentStatus.textContent = 'Hubo un problema con tu pago. Por favor intenta nuevamente.';
        
        // Cambiar el icono a una X
        checkmark.innerHTML = `
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark__check" fill="none" d="M16 16 36 36 M36 16 16 36"/>
        `;
    }
    
    // Animación adicional para las flores
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
        }
        .flower-animation {
            margin: 2rem 0;
            display: flex;
            justify-content: center;
            gap: 1.5rem;
        }
    `;
    document.head.appendChild(style);
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

// Se comunica con el backend de la ia
document.addEventListener("DOMContentLoaded", () => {
    const previewBtn = document.getElementById("preview-btn");
    const aiPreviewImage = document.getElementById("ai-preview-image");

    previewBtn.addEventListener("click", async () => {
        const flowerType = document.getElementById("flower-type").value;
        const flowerQuantity = document.getElementById("flower-quantity").value;
        const flowerColor = document.getElementById("flower-color").value;
        const wrapDesign = document.getElementById("wrap-design").value;
        const wrapColor = document.getElementById("wrap-color").value;

        if (flowerType === "vacio" || flowerQuantity === "vacio" || wrapDesign === "vacio") {
            alert("Por favor, selecciona todas las opciones.");
            return;
        }

        const requestData = {
            flowerType,
            flowerQuantity,
            flowerColor,
            wrapDesign,
            wrapColor
        };

        try {
            const response = await fetch("/generar-imagen", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

            if (data.imageUrl) {
                aiPreviewImage.src = data.imageUrl;
            } else {
                alert("Error al generar la imagen.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Hubo un error al generar la imagen.");
        }
    });
});

//Spiner de carga
const loadingSpinner = document.getElementById("loading-spinner");
loadingSpinner.style.display = "block"; // Mostrar el spinner
aiPreviewImage.src = ""; // Limpiar la imagen previa

// carrito de pago obtener datos del carrito desde la API
async function fetchCart() {
    try {
        const response = await fetch('/api/cart');
        const cart = await response.json();

        const container = document.getElementById('payment-container');
        container.innerHTML = ''; // Limpiar contenido previo

        if (cart.length === 0) {
            container.innerHTML = '<p>El carrito está vacío.</p>';
            return;
        }

        // Renderizar los productos del carrito
        cart.forEach(item => {
            const productDiv = document.createElement('div');
            productDiv.innerHTML = `
                <p><strong>Producto:</strong> ${item.title}</p>
                <p><strong>Precio:</strong> $${item.price}</p>
                <p><strong>Cantidad:</strong> ${item.quantity}</p>
                <hr>
            `;
            container.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', fetchCart);


