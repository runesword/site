document.addEventListener('DOMContentLoaded', () => {

    // --- Referencias DOM para Eventos ---
    const upcomingEventsContainer = document.getElementById('upcoming-events');
    const pastEventsContainer = document.getElementById('past-events');
    const showPastEventsButton = document.getElementById('show-past-events');
    const today = new Date();

    // --- DATOS DE EVENTOS (Carga LOCAL) ELIMINADOS ---
    // Los datos ahora se cargarán mediante la función fetch desde events.json
    // ----------------------------------------------------


    // Función para crear la tarjeta de evento
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

        // --- CÓDIGO ACTIVADO PARA CARGAR DESDE events.json  ---
        let eventsData;
        try {
            const response = await fetch('events.json');
            if (!response.ok) {
                // Lanza un error si la respuesta no es 200 (OK)
                throw new Error('Error al cargar events.json: ' + response.statusText);
            }
            const data = await response.json();
            // Asume que el JSON tiene una clave 'events'
            eventsData = data.events;

        } catch (error) {
            console.error('Fallo al procesar los eventos:', error);
            upcomingEventsContainer.innerHTML = '<p>Error al cargar los eventos. Inténtalo de nuevo más tarde.</p>';
            return;
        }
        // ----------------------------------------------------------------

        // Usamos eventsData cargado mediante fetch
        upcomingEventsContainer.innerHTML = '';
        pastEventsContainer.innerHTML = '';

        eventsData.forEach(event => {
            const eventDateTime = new Date(event.date);
            const isUpcoming = eventDateTime >= today;

            if (!isUpcoming) {
                // Eventos pasados: siempre deshabilitados si ya pasaron
                // Se asegura que el campo 'available' sea false para el botón
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
        "past-event-pics/4.png",
        "past-event-pics/5.jpg"
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