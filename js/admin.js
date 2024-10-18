class AdminTimeline extends Timeline {
    constructor() {
        super();
        this.token = localStorage.getItem('adminToken');
        if (!this.token) {
            window.location.href = 'login.html';
        }
        this.currentPage = 1;
        this.eventsPerPage = 10;
        this.filteredEvents = [];
    }

    async loadEventsFromDatabase() {
        await super.loadEventsFromDatabase();
        this.filteredEvents = [...this.events];
        this.renderAdminEventsList();
        this.updateFilterOptions();
    }

    async addEvent(event) {
        try {
            const response = await fetch('http://localhost:3000/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token
                },
                body: JSON.stringify(event),
            });
            if (response.status === 401) {
                window.location.href = 'login.html';
                return;
            }
            const newEvent = await response.json();
            this.events.push({...newEvent, date: new Date(newEvent.date)});
            this.categories.add(newEvent.category);
            this.renderAdminEventsList();
            await this.logUserActivity('add_event', `Added event: ${event.title}`);
        } catch (error) {
            console.error('Error adding event:', error);
        }
    }

    async updateEvent(updatedEvent) {
        try {
            const response = await fetch(`http://localhost:3000/api/events/${updatedEvent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token
                },
                body: JSON.stringify(updatedEvent),
            });
            if (response.status === 401) {
                window.location.href = 'login.html';
                return;
            }
            const event = await response.json();
            const index = this.events.findIndex(e => e.id === event.id);
            if (index !== -1) {
                this.events[index] = {...event, date: new Date(event.date)};
            }
            this.renderAdminEventsList();
            await this.logUserActivity('update_event', `Updated event: ${updatedEvent.title}`);
        } catch (error) {
            console.error('Error updating event:', error);
        }
    }

    async deleteEvent(eventId) {
        try {
            const response = await fetch(`http://localhost:3000/api/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': this.token
                }
            });
            if (response.status === 401) {
                window.location.href = 'login.html';
                return;
            }
            this.events = this.events.filter(event => event.id !== eventId);
            this.renderAdminEventsList();
            await this.logUserActivity('delete_event', `Deleted event with ID: ${eventId}`);
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    }

    updateFilterOptions() {
        const filterSelect = document.getElementById('filterSelect');
        filterSelect.innerHTML = '<option value="">جميع الفئات</option>';
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            filterSelect.appendChild(option);
        });
    }

    sortEvents(sortBy) {
        switch (sortBy) {
            case 'date-desc':
                this.filteredEvents.sort((a, b) => b.date - a.date);
                break;
            case 'date-asc':
                this.filteredEvents.sort((a, b) => a.date - b.date);
                break;
            case 'category':
                this.filteredEvents.sort((a, b) => a.category.localeCompare(b.category));
                break;
        }
    }

    filterEvents(category) {
        if (category) {
            this.filteredEvents = this.events.filter(event => event.category === category);
        } else {
            this.filteredEvents = [...this.events];
        }
        this.currentPage = 1;
    }

    searchEvents(query) {
        query = query.toLowerCase();
        this.filteredEvents = this.events.filter(event => 
            event.title.toLowerCase().includes(query) ||
            event.description.toLowerCase().includes(query) ||
            event.category.toLowerCase().includes(query)
        );
        this.currentPage = 1;
    }

    renderAdminEventsList() {
        const eventsList = document.getElementById('adminEventsList');
        eventsList.innerHTML = '';

        const startIndex = (this.currentPage - 1) * this.eventsPerPage;
        const endIndex = startIndex + this.eventsPerPage;
        const eventsToShow = this.filteredEvents.slice(startIndex, endIndex);

        eventsToShow.forEach(event => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="admin-event">
                    <h3>${event.title}</h3>
                    <p>${event.date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p>${event.category}</p>
                    <div class="admin-event-actions">
                        <button onclick="editEvent(${event.id})">تعديل</button>
                        <button onclick="deleteEvent(${event.id})">حذف</button>
                    </div>
                </div>
            `;
            eventsList.appendChild(li);
        });

        this.updatePagination();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredEvents.length / this.eventsPerPage);
        document.getElementById('currentPage').textContent = `الصفحة ${this.currentPage} من ${totalPages}`;
        document.getElementById('prevPage').disabled = this.currentPage === 1;
        document.getElementById('nextPage').disabled = this.currentPage === totalPages;
    }

    async logUserActivity(action, details) {
        try {
            const response = await fetch('http://localhost:3000/api/log-activity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token
                },
                body: JSON.stringify({
                    action: action,
                    details: details
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to log user activity');
            }
        } catch (error) {
            console.error('Error logging user activity:', error);
        }
    }
}

const adminTimeline = new AdminTimeline();

document.addEventListener('DOMContentLoaded', function() {
    adminTimeline.loadEventsFromDatabase();

    document.getElementById('adminForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        if (validateForm()) {
            const eventId = document.getElementById('eventId').value;
            const event = {
                title: document.getElementById('title').value,
                date: document.getElementById('date').value,
                category: document.getElementById('category').value,
                description: document.getElementById('description').value,
                image: document.getElementById('image').value
            };

            if (eventId) {
                event.id = parseInt(eventId);
                await adminTimeline.updateEvent(event);
            } else {
                await adminTimeline.addEvent(event);
            }

            this.reset();
            document.getElementById('eventId').value = '';
        }
    });

    function validateForm() {
        let isValid = true;
        const title = document.getElementById('title');
        const titleError = document.getElementById('titleError');

        if (title.validity.valueMissing) {
            titleError.textContent = 'العنوان مطلوب';
            isValid = false;
        } else if (title.validity.tooShort) {
            titleError.textContent = 'العنوان يجب أن يكون 3 أحرف على الأقل';
            isValid = false;
        } else {
            titleError.textContent = '';
        }

        // Add similar validation for other fields

        return isValid;
    }

    document.getElementById('sortSelect').addEventListener('change', function() {
        adminTimeline.sortEvents(this.value);
        adminTimeline.renderAdminEventsList();
    });

    document.getElementById('filterSelect').addEventListener('change', function() {
        adminTimeline.filterEvents(this.value);
        adminTimeline.renderAdminEventsList();
    });

    document.getElementById('searchButton').addEventListener('click', function() {
        const query = document.getElementById('searchInput').value;
        adminTimeline.searchEvents(query);
        adminTimeline.renderAdminEventsList();
    });

    document.getElementById('prevPage').addEventListener('click', function() {
        if (adminTimeline.currentPage > 1) {
            adminTimeline.currentPage--;
            adminTimeline.renderAdminEventsList();
        }
    });

    document.getElementById('nextPage').addEventListener('click', function() {
        const totalPages = Math.ceil(adminTimeline.filteredEvents.length / adminTimeline.eventsPerPage);
        if (adminTimeline.currentPage < totalPages) {
            adminTimeline.currentPage++;
            adminTimeline.renderAdminEventsList();
        }
    });
});

async function editEvent(eventId) {
    const event = adminTimeline.events.find(e => e.id === eventId);
    if (event) {
        document.getElementById('eventId').value = event.id;
        document.getElementById('title').value = event.title;
        document.getElementById('date').value = event.date.toISOString().split('T')[0];
        document.getElementById('category').value = event.category;
        document.getElementById('description').value = event.description;
        document.getElementById('image').value = event.image || '';
    }
}

async function deleteEvent(eventId) {
    if (confirm('هل أنت متأكد من حذف هذا الحدث؟')) {
        try {
            await adminTimeline.deleteEvent(eventId);
            showNotification('تم حذف الحدث بنجاح', 'success');
        } catch (error) {
            console.error('Error deleting event:', error);
            showNotification('حدث خطأ أثناء حذف الحدث. يرجى المحاولة مرة أخرى.', 'error');
        }
    }
}
