document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const photoContainer = document.getElementById('photo-container');
  const announcement = document.querySelector('.announcement');
  const countdown = document.querySelector('.countdown');
  const rsvp = document.querySelector('.rsvp');
  const daysElement = document.getElementById('days');
  const hoursElement = document.getElementById('hours');
  const minutesElement = document.getElementById('minutes');
  const secondsElement = document.getElementById('seconds');

  // =============================================
  // 1. VERIFICACIÓN DE LA IMAGEN (CON CONSOLA)
  // =============================================
  const img = new Image();
  img.src = 'fotoboda.JPEG';
  
  img.onload = function() {
    console.log('✅ Foto cargada correctamente');
    photoContainer.style.opacity = 1;
  };
  
  img.onerror = function() {
    console.error('❌ Error: No se pudo cargar fotoboda.JPEG');
    console.log('Verifica que:');
    console.log('1. El archivo existe y se llama EXACTAMENTE "fotoboda.JPEG"');
    console.log('2. Está en la misma carpeta que tu index.html');
    console.log('3. No tiene caracteres especiales o espacios');
  };

  // =============================================
  // 2. EFECTO DE SCROLL (TRANSPARENCIA + ANIMACIONES)
  // =============================================
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Efecto de transparencia (comienza después de 100px)
    const opacity = 1 - Math.min(scrollPosition / (windowHeight * 0.7), 0.9);
    photoContainer.style.opacity = opacity;
    
    // Mostrar elementos al hacer scroll
    if (scrollPosition > windowHeight * 0.2) {
      announcement.classList.add('show');
    }
    if (scrollPosition > windowHeight * 0.4) {
      countdown.classList.add('show');
    }
    if (scrollPosition > windowHeight * 0.6) {
      rsvp.classList.add('show');
    }
  });

  // =============================================
  // 3. CUENTA REGRESIVA (HORA EXACTA: 13 SEP 2025, 12:00)
  // =============================================
  function updateCountdown() {
    const weddingDate = new Date('September 13, 2025 12:00:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;
    
    if (distance < 0) {
      clearInterval(countdownInterval);
      document.getElementById('countdown-timer').innerHTML = '<div>¡Hoy es el día!</div>';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    daysElement.textContent = days;
    hoursElement.textContent = hours;
    minutesElement.textContent = minutes;
    secondsElement.textContent = seconds;
  }
  
  // Iniciar cuenta regresiva
  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);

  // =============================================
  // 4. INICIALIZACIÓN (EVITA FALLOS DE RENDERIZADO)
  // =============================================
  setTimeout(() => {
    photoContainer.style.opacity = 1;
  }, 100);
});