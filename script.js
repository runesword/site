document.addEventListener('DOMContentLoaded', () => {
    
    // Correo de Inscripción por defecto
    const DEFAULT_EMAIL = "mailto:asociacionrunesword@gmail.com";

    // --- Referencias DOM para Eventos ---
    const upcomingEventsContainer = document.getElementById('upcoming-events');
    const pastEventsContainer = document.getElementById('past-events');
    const showPastEventsButton = document.getElementById('show-past-events');
    const today = new Date(); // Usado para comparar y filtrar eventos

    // Función para crear la tarjeta de evento
    const createEventCard = (event) => {
        const eventDate = new Date(event.date); 
        
        const dateString = eventDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        const timeString = eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }); 

        // Lógica para determinar el enlace de inscripción
        const inscriptionLink = event.formUrl && event.formUrl.trim() !== '' 
                                ? event.formUrl 
                                : DEFAULT_EMAIL;
        
        // Determina el texto del botón
        const buttonText = event.formUrl && event.formUrl.trim() !== '' 
                           ? "Inscripción (Formulario)" 
                           : "Inscripción (Email)";

        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <img src="${event.image}" alt="${event.title}">
            <div class="event-info">
                <h3>${event.title}</h3>
                <p><i class="fas fa-calendar-alt"></i> <span class="date">${dateString} (${timeString}h)</span></p>
                <p><i class="fas fa-map-marker-alt"></i> <span class="location">${event.location}</span></p>
                <p>${event.description}</p>
                <a href="${inscriptionLink}" target="_blank" class="cta-button event-button">${buttonText}</a>
            </div>
        `;
        return card;
    };

    // Función principal para cargar y clasificar eventos desde events.json
    const loadEvents = async () => {
        try {
            // Petición fetch al archivo JSON
            const response = await fetch('events.json'); 
            if (!response.ok) {
                throw new Error('Error al cargar events.json: ' + response.statusText);
            }
            const data = await response.json();
            const eventsData = data.events;

            upcomingEventsContainer.innerHTML = '';
            pastEventsContainer.innerHTML = '';

            eventsData.forEach(event => {
                const eventDateTime = new Date(event.date);
                // Si la fecha y hora del evento es pasada, va a 'past-events'
                if (eventDateTime < today) {
                    pastEventsContainer.appendChild(createEventCard(event));
                } else {
                    upcomingEventsContainer.appendChild(createEventCard(event));
                }
            });
            
            // Si no hay eventos próximos, muestra un mensaje
            if (upcomingEventsContainer.children.length === 0) {
                 upcomingEventsContainer.innerHTML = '<p>¡No hay eventos próximos programados! Síguenos en redes para las novedades.</p>';
            }

        } catch (error) {
            console.error('Fallo al procesar los eventos:', error);
            upcomingEventsContainer.innerHTML = '<p>Error al cargar los eventos. Inténtalo de nuevo más tarde.</p>';
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