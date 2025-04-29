document.addEventListener('DOMContentLoaded', function() {
  // Cargar datos JSON
  fetch('data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      initializeApp(data);
    })
    .catch(error => {
      console.error('Error cargando JSON:', error);
      // Cargar datos por defecto si hay error
      initializeApp({
        weddingDate: "September 13, 2025 12:00:00 GMT+0200",
        images: {
          mainPhoto: "fotoboda.JPEG",
          churchPhoto: "fotoiglesia.JPEG",
          restaurantPhoto: "fotorestaurante.JPEG"
        },
        locations: {
          church: {
            title: "NOS CASAMOS AQUÍ",
            time: "13 de Septiembre 2025 · 12:00",
            mapUrl: "https://maps.google.com/maps?q=iglesia+collbat%C3%B3&output=embed"
          },
          restaurant: {
            title: "CELEBRACIÓN",
            time: "Restaurante · 14:30",
            mapUrl: "https://maps.google.com/maps?q=els+4+vents&output=embed"
          }
        },
        texts: {
          mainTitle: "Nos Casamos",
          invitationText: "Con gran alegría queremos compartir este momento especial con ustedes",
          rsvpText: "Confirmar Asistencia"
        }
      });
    });

  function initializeApp(data) {
    // Elementos del DOM
    const elements = {
      photoContainer: document.getElementById('photo-container'),
      mainTitle: document.getElementById('main-title'),
      invitationText: document.getElementById('invitation-text'),
      rsvpLink: document.getElementById('rsvp-link'),
      churchTitle: document.getElementById('church-title'),
      churchTime: document.getElementById('church-time'),
      restaurantTitle: document.getElementById('restaurant-title'),
      restaurantTime: document.getElementById('restaurant-time'),
      announcement: document.querySelector('.announcement'),
      countdown: document.querySelector('.countdown'),
      rsvp: document.querySelector('.rsvp'),
      daysElement: document.getElementById('days'),
      hoursElement: document.getElementById('hours'),
      minutesElement: document.getElementById('minutes'),
      secondsElement: document.getElementById('seconds'),
      churchSection: document.getElementById('church-section'),
      restaurantSection: document.getElementById('restaurant-section'),
      churchMap: document.getElementById('church-map'),
      restaurantMap: document.getElementById('restaurant-map'),
      churchImage: document.getElementById('church-image'),
      restaurantImage: document.getElementById('restaurant-image')
    };

    // 1. Cargar textos desde JSON
    elements.mainTitle.textContent = data.texts.mainTitle;
    elements.invitationText.textContent = data.texts.invitationText;
    elements.rsvpLink.textContent = data.texts.rsvpText;
    elements.churchTitle.textContent = data.locations.church.title;
    elements.churchTime.textContent = data.locations.church.time;
    elements.restaurantTitle.textContent = data.locations.restaurant.title;
    elements.restaurantTime.textContent = data.locations.restaurant.time;

    // 2. Configurar imágenes con manejo de errores
    const loadImage = (element, src, isBackground = true) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (isBackground) {
            element.style.backgroundImage = `url('${src}')`;
          } else {
            element.src = src;
          }
          resolve();
        };
        img.onerror = () => {
          console.error(`Error cargando imagen: ${src}`);
          if (isBackground) {
            element.style.backgroundColor = '#f0f0f0';
            element.innerHTML = '<p class="error-text">Imagen no disponible</p>';
          }
          resolve();
        };
        img.src = src;
      });
    };

    // Cargar todas las imágenes en paralelo
    Promise.all([
      loadImage(elements.photoContainer, data.images.mainPhoto),
      loadImage(elements.churchImage, data.images.churchPhoto),
      loadImage(elements.restaurantImage, data.images.restaurantPhoto)
    ]).then(() => {
      elements.photoContainer.style.opacity = 1;
    });

    // 3. Configurar mapas
    elements.churchMap.innerHTML = `<iframe src="${data.locations.church.mapUrl}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
    elements.restaurantMap.innerHTML = `<iframe src="${data.locations.restaurant.mapUrl}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;

    // 4. Efectos de scroll
    window.addEventListener('scroll', function() {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Efectos para la primera sección
      elements.photoContainer.style.opacity = 1 - Math.min(scrollPosition / (windowHeight * 0.7), 0.9);
      
      // Mostrar elementos al hacer scroll
      if (scrollPosition > windowHeight * 0.2) {
        elements.announcement.classList.add('show');
      }
      if (scrollPosition > windowHeight * 0.4) {
        elements.countdown.classList.add('show');
      }
      if (scrollPosition > windowHeight * 0.6) {
        elements.rsvp.classList.add('show');
      }
      
      // Mostrar sección iglesia
      if (scrollPosition > windowHeight * 1.2) {
        elements.churchSection.classList.add('show-section');
      } else {
        elements.churchSection.classList.remove('show-section');
      }
      
      // Mostrar sección restaurante
      if (scrollPosition > windowHeight * 2.2) {
        elements.restaurantSection.classList.add('show-section');
        elements.churchSection.classList.remove('show-section');
      } else if (scrollPosition < windowHeight * 1.8) {
        elements.restaurantSection.classList.remove('show-section');
      }
    });

    // 5. Cuenta regresiva
    function updateCountdown() {
      const weddingDate = new Date(data.weddingDate).getTime();
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
      
      elements.daysElement.textContent = days.toString().padStart(2, '0');
      elements.hoursElement.textContent = hours.toString().padStart(2, '0');
      elements.minutesElement.textContent = minutes.toString().padStart(2, '0');
      elements.secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    // 6. Inicialización final
    setTimeout(() => {
      elements.photoContainer.style.opacity = 1;
    }, 100);
  }
});