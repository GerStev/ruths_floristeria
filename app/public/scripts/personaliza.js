document.addEventListener('DOMContentLoaded', function() {
  // Control de colores
  const flowerColorInput = document.getElementById('flower-color');
  const flowerColorPreview = document.getElementById('flower-color-preview');
  const wrapColorInput = document.getElementById('wrap-color');
  const wrapColorPreview = document.getElementById('wrap-color-preview');
  const previewImage = document.getElementById('ai-preview-image');
  const previewContainer = document.querySelector('.preview');
  const regenerateBtn = document.getElementById('regenerate-btn');

  // Cargar imagen guardada si existe
  const savedImage = localStorage.getItem('lastGeneratedImage');
  if (savedImage) {
    previewImage.src = savedImage;
    previewImage.style.display = 'block';
    previewContainer.classList.add('has-image');
  }

  flowerColorInput.addEventListener('input', function() {
    flowerColorPreview.style.backgroundColor = flowerColorInput.value;
  });

  wrapColorInput.addEventListener('input', function() {
    wrapColorPreview.style.backgroundColor = wrapColorInput.value;
  });

  // Función para convertir código HEX a nombre de color aproximado
  function getColorName(hexColor) {
    const colors = {
      '#ff0000': 'rojo', '#ff4500': 'naranja rojizo', '#ff8c00': 'naranja oscuro',
      '#ffa500': 'naranja', '#ffd700': 'dorado', '#ffff00': 'amarillo',
      '#9acd32': 'amarillo verdoso', '#008000': 'verde', '#00ff00': 'verde lima',
      '#00fa9a': 'verde medio', '#40e0d0': 'turquesa', '#00ffff': 'cian',
      '#0000ff': 'azul', '#000080': 'azul marino', '#4b0082': 'índigo',
      '#800080': 'púrpura', '#ee82ee': 'violeta', '#ff00ff': 'magenta',
      '#ff1493': 'rosa intenso', '#ff69b4': 'rosa', '#ffc0cb': 'rosa claro',
      '#ffffff': 'blanco', '#f5f5dc': 'beige', '#a52a2a': 'marrón',
      '#8b4513': 'marrón claro', '#000000': 'negro'
    };
    
    let closestColor = 'multicolor';
    let minDistance = Infinity;
    
    for (const [hex, name] of Object.entries(colors)) {
      const distance = colorDistance(hexColor, hex);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = name;
      }
    }
    
    return closestColor;
  }

  function colorDistance(hex1, hex2) {
    const r1 = parseInt(hex1.substring(1, 3), 16);
    const g1 = parseInt(hex1.substring(3, 5), 16);
    const b1 = parseInt(hex1.substring(5, 7), 16);
    
    const r2 = parseInt(hex2.substring(1, 3), 16);
    const g2 = parseInt(hex2.substring(3, 5), 16);
    const b2 = parseInt(hex2.substring(5, 7), 16);
    
    return Math.sqrt(
      Math.pow(r1 - r2, 2) + 
      Math.pow(g1 - g2, 2) + 
      Math.pow(b1 - b2, 2)
    );
  }

  // Función para generar la imagen
  async function generateImage() {
    const arrangementType = document.getElementById("arrangement-type").value;
    const flowerMaterial = document.getElementById("flower-material").value;
    const flowerType = document.getElementById("flower-type").value;
    const flowerQuantity = document.getElementById("flower-quantity").value;
    const flowerColor = document.getElementById("flower-color").value;
    const wrapDesign = document.getElementById("wrap-design").value;
    const wrapColor = document.getElementById("wrap-color").value;

    if (arrangementType === "vacio" || flowerMaterial === "vacio" || 
        flowerType === "vacio" || flowerQuantity === "vacio" || 
        wrapDesign === "vacio") {
      alert("Por favor, completa todas las opciones de personalización.");
      return;
    }

    const loadingSpinner = document.getElementById("loading-spinner");
    loadingSpinner.style.display = "flex";
    previewImage.style.display = "none";

    try {
      const flowerColorName = getColorName(flowerColor);
      const wrapColorName = getColorName(wrapColor);

      const prompt = `Un ${arrangementType} floral profesional compuesto por ${flowerQuantity} ${flowerType} ${flowerMaterial} de color ${flowerColorName}, 
      envuelto en un diseño ${wrapDesign} de color ${wrapColorName}. La imagen debe ser realista, bien iluminada, 
      con fondo neutro y estilo profesional de fotografía de producto. Alta calidad, detallada, 4K`;

      const response = await fetch("/generar-imagen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const data = await response.json();

      if (data.imageUrl) {
        previewImage.src = data.imageUrl;
        previewImage.style.display = "block";
        loadingSpinner.style.display = "none";
        previewContainer.classList.add("has-image");
        
        // Guardar la imagen en localStorage
        localStorage.setItem('lastGeneratedImage', data.imageUrl);
      } else {
        throw new Error("No se recibió URL de imagen");
      }
    } catch (error) {
      console.error("Error al generar la imagen:", error);
      loadingSpinner.style.display = "none";
      alert("Ocurrió un error al generar la vista previa. Por favor, intenta nuevamente.");
    }
  }

  // Evento para el botón de generar vista previa
  document.getElementById("preview-btn").addEventListener("click", generateImage);

  // Evento para el botón de regenerar imagen
  regenerateBtn.addEventListener("click", generateImage);

  // Limpiar la imagen cuando se cambia alguna selección
  const formInputs = document.querySelectorAll('select, input[type="color"]');
  formInputs.forEach(input => {
    input.addEventListener('change', () => {
      if (previewContainer.classList.contains('has-image')) {
        previewContainer.classList.remove('has-image');
        localStorage.removeItem('lastGeneratedImage');
      }
    });
  });
});

// Función para ajustar la altura de la imagen en dispositivos móviles
function adjustImageHeight() {
  const previewImage = document.getElementById('ai-preview-image');
  if (!previewImage) return;

  if (window.innerWidth <= 767) {
    // Para móviles en orientación vertical
    if (window.innerHeight > window.innerWidth) {
      previewImage.style.maxHeight = '50vh';
    } 
    // Para móviles en orientación horizontal
    else {
      previewImage.style.maxHeight = '60vh';
    }
  } else {
    previewImage.style.maxHeight = '';
  }
}

// Ejecutar al cargar y al cambiar el tamaño/orientación
window.addEventListener('load', adjustImageHeight);
window.addEventListener('resize', adjustImageHeight);
window.addEventListener('orientationchange', adjustImageHeight);