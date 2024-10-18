function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    function performSearch() {
        try {
            const searchTerm = searchInput.value.trim().toLowerCase();
            if (searchTerm) {
                const searchResults = timeline.events.filter(event => 
                    event.title.toLowerCase().includes(searchTerm) ||
                    event.description.toLowerCase().includes(searchTerm) ||
                    event.category.toLowerCase().includes(searchTerm) ||
                    event.date.toLocaleDateString('ar-EG').includes(searchTerm)
                );
                timeline.renderTimeline('', searchResults);
            } else {
                timeline.renderTimeline();
            }
        } catch (error) {
            console.error('Error during search:', error);
            showNotification('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.', 'error');
        }
    }

    searchButton.addEventListener('click', performSearch);

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // إضافة مستمع الحدث للنقر على الصور لتكبيرها
    document.getElementById('timeline').addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG') {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <img src="${e.target.src}" alt="${e.target.alt}">
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelector('.close').onclick = function() {
                document.body.removeChild(modal);
            };

            window.onclick = function(event) {
                if (event.target == modal) {
                    document.body.removeChild(modal);
                }
            };
        }
    });
});
