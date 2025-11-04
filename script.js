document.addEventListener('DOMContentLoaded', () => {

    // --- Referencias DOM para Eventos ---
    const upcomingEventsContainer = document.getElementById('upcoming-events');
    const pastEventsContainer = document.getElementById('past-events');
    const showPastEventsButton = document.getElementById('show-past-events');
    const today = new Date();

    // --- DATOS DE EVENTOS (Carga LOCAL) ---
    // NOTA: Se ha añadido el campo "available" a cada evento.
    const eventsData = [
        {
            "image": "https://bbtournaments.es/files/tournament%20picture/Bolo%20Bowl%20Toledo%20I-2025-09-22-21-38-05.jpg",
            "title": "Torneo de Wargames",
            "date": "2025-11-10T16:00:00",
            "location": "Calle Gamer 42, Toledo",
            "description": "Un torneo épico de wargames con premios y diversión asegurada.",
            "available": true // ¡Inscripción disponible!
        },
        {
            "image": "https://bbtournaments.es/files/tournament%20picture/Bolo%20Bowl%20Toledo%20I-2025-09-22-21-38-05.jpg",
            "title": "Torneo de Wargames",
            "date": "2025-11-10T16:00:00",
            "location": "Calle Gamer 42, Toledo",
            "description": "Un torneo épico de wargames con premios y diversión asegurada.",
            "available": true // ¡Inscripción disponible!
        },
        {
            "image": "https://via.placeholder.com/500x300/800080/FFFFFF?text=Workshop+Pintura",
            "title": "Workshop de Pintura de Miniaturas",
            "date": "2025-11-20T17:30:00",
            "location": "Plaza de los Dados, Toledo",
            "description": "Mejora tus habilidades de pintura en este taller práctico.",
            "available": false // Inscripción NO disponible
        },
        {
            "image": "https://via.placeholder.com/500x300/5E3C75/FFFFFF?text=Juegos+de+Mesa",
            "title": "Tarde de Juegos de Mesa",
            "date": "2025-11-30T18:00:00",
            "location": "Casa de la Asociación, Toledo",
            "description": "Ven a disfrutar de una tarde llena de juegos y diversión.",
            "available": true // ¡Inscripción disponible!
        },
        {
            "image": "https://weezevent.com/wp-content/uploads/2023/08/28153716/organizar-una-velada-de-juegos-de-mesa.jpg",
            "title": "Evento Pasado de Prueba",
            "date": "2025-01-01T10:00:00",
            "location": "Local de Prueba",
            "description": "Este evento ya ha pasado y se debe ver solo con el botón de Eventos Pasados.",
            "available": false // Ya pasó, no está disponible
        },
        {
            "image": "https://weezevent.com/wp-content/uploads/2023/08/28153716/organizar-una-velada-de-juegos-de-mesa.jpg",
            "title": "Evento Pasado de Prueba",
            "date": "2025-01-01T10:00:00",
            "location": "Local de Prueba",
            "description": "Este evento ya ha pasado y se debe ver solo con el botón de Eventos Pasados.",
            "available": false // Ya pasó, no está disponible
        },
        {
            "image": "https://weezevent.com/wp-content/uploads/2023/08/28153716/organizar-una-velada-de-juegos-de-mesa.jpg",
            "title": "Evento Pasado de Prueba",
            "date": "2025-01-01T10:00:00",
            "location": "Local de Prueba",
            "description": "Este evento ya ha pasado y se debe ver solo con el botón de Eventos Pasados.",
            "available": false // Ya pasó, no está disponible
        },
        {
            "image": "https://weezevent.com/wp-content/uploads/2023/08/28153716/organizar-una-velada-de-juegos-de-mesa.jpg",
            "title": "Evento Pasado de Prueba",
            "date": "2025-01-01T10:00:00",
            "location": "Local de Prueba",
            "description": "Este evento ya ha pasado y se debe ver solo con el botón de Eventos Pasados.",
            "available": false // Ya pasó, no está disponible
        }
    ];
    // ------------------------------------


    // Función para crear la tarjeta de evento
    // Se ha eliminado el parámetro 'isUpcoming' ya que la disponibilidad se basa ahora en 'event.available'
    const createEventCard = (event) => {
        const eventDate = new Date(event.date);

        const dateString = eventDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        const timeString = eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

        // Lógica para el botón
        let buttonText = '¡Inscríbete aquí!';
        let buttonClass = 'enroll-button';
        let buttonLink = `mailto:asociacionrunesword@gmail.com?subject=Inscripción al evento: ${event.title}`;

        if (!event.available) {
            buttonText = 'Inscripciones cerradas';
            buttonClass += ' disabled'; // Añade la clase 'disabled'
            buttonLink = '#'; // Quita el enlace mailto
        }

        const enrollButtonHTML = `<a href="${buttonLink}" class="${buttonClass}">${buttonText}</a>`;

        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <img src="${event.image}" alt="${event.title}">
            <div class="event-info">
                <h3>${event.title}</h3>
                <p><i class="fas fa-calendar-alt"></i> <span class="date">${dateString} (${timeString}h)</span></p>
                <p><i class="fas fa-map-marker-alt"></i> <span class="location">${event.location}</span></p>
                <p>${event.description}</p>
                ${enrollButtonHTML} </div>
        `;
        return card;
    };

    // Función principal para cargar y clasificar eventos
    const loadEvents = async () => {
        // ... (Código sin cambios) ...

        upcomingEventsContainer.innerHTML = '';
        pastEventsContainer.innerHTML = '';

        eventsData.forEach(event => {
            const eventDateTime = new Date(event.date);
            const isUpcoming = eventDateTime >= today;

            if (!isUpcoming) {
                // Eventos pasados: siempre deshabilitados si ya pasaron
                pastEventsContainer.appendChild(createEventCard({ ...event, available: false }));
            } else {
                // Eventos próximos: usan el campo 'available' del JSON
                upcomingEventsContainer.appendChild(createEventCard(event));
            }
        });

        // Si no hay eventos próximos, muestra un mensaje
        if (upcomingEventsContainer.children.length === 0) {
            upcomingEventsContainer.innerHTML = '<p>¡No hay eventos próximos programados! Síguenos en redes para las novedades.</p>';
        }
    };

    // Lógica del botón de eventos pasados
    showPastEventsButton.addEventListener('click', () => {
        const isHidden = pastEventsContainer.style.display === 'none';
        pastEventsContainer.style.display = isHidden ? 'grid' : 'none';
        showPastEventsButton.textContent = isHidden ? 'Ocultar Eventos Pasados' : 'Ver Eventos Pasados';
    });

    // Iniciar la carga de eventos
    loadEvents();


    // --- Scroll Reveal (Mostrar secciones al hacer scroll) ---
    const sections = document.querySelectorAll('.section:not(#inicio)');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('hidden');
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- Carrusel de Fotos: Carga dinámica ---

    // Lista de las rutas de las imágenes en la carpeta 'past-event-pics'
    const imagePaths = [
        "past-event-pics/1.jpg",
        "past-event-pics/2.jpg",
        "past-event-pics/3.jpg",
        "past-event-pics/4.jpg",
        "past-event-pics/5.jpg",
        "past-event-pics/6.jpg"
    ];

    const carouselTrack = document.getElementById('photo-carousel');
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');

    // Función para cargar las imágenes y luego inicializar el carrusel
    const loadGalleryImages = () => {
        imagePaths.forEach((path, index) => {
            const img = document.createElement('img');
            img.src = path;
            img.alt = `Foto de evento ${index + 1}`;
            img.className = 'carousel-slide';
            carouselTrack.appendChild(img);
        });

        initializeCarousel();
    };

    // --- Función de Inicialización del Carrusel ---
    const initializeCarousel = () => {
        const slides = Array.from(carouselTrack.children);
        if (slides.length === 0) return;

        const slideWidth = slides[0].getBoundingClientRect().width;
        let slideIndex = 0;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        slides.forEach(setSlidePosition);

        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            slideIndex = slides.indexOf(targetSlide);
        };

        nextButton.addEventListener('click', () => {
            let targetIndex = (slideIndex + 1) % slides.length;
            const targetSlide = slides[targetIndex];
            moveToSlide(carouselTrack, slides[slideIndex], targetSlide);
        });

        prevButton.addEventListener('click', () => {
            let targetIndex = (slideIndex - 1 + slides.length) % slides.length;
            const targetSlide = slides[targetIndex];
            moveToSlide(carouselTrack, slides[slideIndex], targetSlide);
        });
    };

    loadGalleryImages();
});