document.addEventListener('DOMContentLoaded', function() {
  const flowerColorInput = document.getElementById('flower-color');
  const flowerColorPreview = document.getElementById('flower-color-preview');
  const wrapColorInput = document.getElementById('wrap-color');
  const wrapColorPreview = document.getElementById('wrap-color-preview');

  flowerColorInput.addEventListener('input', function() {
      flowerColorPreview.style.backgroundColor = flowerColorInput.value;
  });

  wrapColorInput.addEventListener('input', function() {
      wrapColorPreview.style.backgroundColor = wrapColorInput.value;
  });
});