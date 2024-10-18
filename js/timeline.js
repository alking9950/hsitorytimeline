class Timeline {
    constructor() {
        this.events = [];
        this.categories = new Set();
        this.cache = {};
    }

    async loadEventsFromDatabase() {
        const cachedEvents = localStorage.getItem('cachedEvents');
        const cacheTimestamp = localStorage.getItem('cacheTimestamp');

        if (cachedEvents && cacheTimestamp) {
            const now = new Date().getTime();
            const cacheAge = now - parseInt(cacheTimestamp);

            if (cacheAge < 3600000) { // Cache is less than 1 hour old
                this.events = JSON.parse(cachedEvents);
                this.events.forEach(event => {
                    event.date = new Date(event.date);
                    this.categories.add(event.category);
                });
                this.renderTimeline();
                this.renderCategories();
                return;
            }
        }

        // If cache is invalid or doesn't exist, fetch from server
        const loader = document.createElement('div');
        loader.className = 'loader';
        document.getElementById('timeline').appendChild(loader);
        loader.style.display = 'block';

        try {
            const response = await fetch('http://localhost:3000/api/events');
            const events = await response.json();
            this.events = events.map(event => ({
                ...event,
                date: new Date(event.date)
            }));
            this.events.forEach(event => this.categories.add(event.category));

            // Update cache
            localStorage.setItem('cachedEvents', JSON.stringify(this.events));
            localStorage.setItem('cacheTimestamp', new Date().getTime().toString());

            this.renderTimeline();
            this.renderCategories();
        } catch (error) {
            console.error('Error loading events:', error);
            showNotification('حدث خطأ أثناء تحميل الأحداث. يرجى المحاولة مرة أخرى.', 'error');
        } finally {
            loader.style.display = 'none';
        }
    }

    addEvent(event) {
        this.events.push(event);
        this.categories.add(event.category);
    }

    renderTimeline(filter = '', searchResults = null) {
        const timelineContainer = document.getElementById('timeline');
        timelineContainer.innerHTML = '';

        let eventsToRender = searchResults || this.events;

        if (filter && !searchResults) {
            eventsToRender = eventsToRender.filter(event => event.category === filter);
        }

        eventsToRender.sort((a, b) => a.date - b.date);

        if (eventsToRender.length === 0) {
            timelineContainer.innerHTML = '<p>لا توجد أحداث مطابقة للبحث.</p>';
            return;
        }

        eventsToRender.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'timeline-event';
            eventElement.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h3>${event.title}</h3>
                    <p class="event-date">${event.date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p class="event-category">${event.category}</p>
                    <p>${event.description}</p>
                    ${event.image ? `<img src="${event.image}" alt="${event.title}" loading="lazy">` : ''}
                </div>
            `;
            timelineContainer.appendChild(eventElement);
        });
    }

    renderCategories() {
        const categoriesContainer = document.getElementById('categories');
        categoriesContainer.innerHTML = '<h2>الفئات</h2>';
        const categoryList = document.createElement('ul');
        categoryList.className = 'category-list';
        
        const allCategoryItem = document.createElement('li');
        allCategoryItem.textContent = 'الكل';
        allCategoryItem.addEventListener('click', () => this.renderTimeline());
        categoryList.appendChild(allCategoryItem);

        this.categories.forEach(category => {
            const categoryItem = document.createElement('li');
            categoryItem.textContent = category;
            categoryItem.addEventListener('click', () => this.renderTimeline(category));
            categoryList.appendChild(categoryItem);
        });

        categoriesContainer.appendChild(categoryList);
    }

    async loadRandomEvent() {
        try {
            const response = await fetch('http://localhost:3000/api/events/random');
            const event = await response.json();
            this.renderRandomEvent(event);
        } catch (error) {
            console.error('Error loading random event:', error);
        }
    }

    renderRandomEvent(event) {
        const randomEventContent = document.getElementById('random-event-content');
        randomEventContent.innerHTML = `
            <div class="random-event">
                <h3>${event.title}</h3>
                <p class="event-date">${new Date(event.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p class="event-category">${event.category}</p>
                <p>${event.description}</p>
                ${event.image ? `<img src="${event.image}" alt="${event.title}" loading="lazy">` : ''}
            </div>
        `;
    }
}

const timeline = new Timeline();

document.addEventListener('DOMContentLoaded', function() {
    timeline.loadEventsFromDatabase();
    timeline.loadRandomEvent();

    document.getElementById('load-random-event').addEventListener('click', () => {
        timeline.loadRandomEvent();
    });
});
