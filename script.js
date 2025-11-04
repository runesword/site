document.addEventListener("DOMContentLoaded", function () {
    const eventsContainer = document.querySelector("#event-list");
    const pastEventsBtn = document.querySelector("#eventos-pasados");

    fetch("events.json")
        .then((response) => response.json())
        .then((data) => {
            const today = new Date();
            const upcomingEvents = data.events.filter((event) => new Date(event.date) >= today);
            const pastEvents = data.events.filter((event) => new Date(event.date) < today);

            renderEvents(upcomingEvents);

            pastEventsBtn.addEventListener("click", () => {
                eventsContainer.innerHTML = "";
                renderEvents(pastEvents);
            });
        });

    function renderEvents(events) {
        events.forEach((event) => {
            const eventItem = document.createElement("li");
            eventItem.innerHTML = `
                <img src="${event.image}" alt="${event.title}" style="max-width: 100%; border-radius: 10px; margin-bottom: 10px;"> 
                <h3>${event.title}</h3>
                <p><strong>Fecha:</strong> ${event.date}</p>
                <p><strong>Lugar:</strong> ${event.location}</p>
                <p>${event.description}</p>
            `;
            eventsContainer.appendChild(eventItem);
        });
    }
});