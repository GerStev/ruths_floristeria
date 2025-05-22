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
        stretch: 0,
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
        el: ".swiper-pagination"
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
        "value": 0.7,
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
          "speed": 4,
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
  
  if (window.innerWidth >= 1024) {
    var script = document.createElement('script');
    script.src = '/scripts/particles.min.js';
    script.onload = function() {
        var configScript = document.createElement('script');
        configScript.src = '/scripts/particles-config.js';
        document.body.appendChild(configScript);
    };
    document.body.appendChild(script);
} else {
    // Si quieres, puedes ocultar el div de partículas en móviles
    var particlesDiv = document.getElementById('particles-js');
    if (particlesDiv) particlesDiv.style.display = 'none';
}