document.addEventListener('DOMContentLoaded', function() {
    const advancedSearchForm = document.getElementById('advancedSearchForm');
    const categoryFilter = document.getElementById('categoryFilter');

    // Populate category filter
    timeline.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    advancedSearchForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const query = document.getElementById('advancedSearchInput').value;
        const category = categoryFilter.value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        try {
            const response = await fetch(`http://localhost:3000/api/search?query=${query}&category=${category}&start_date=${startDate}&end_date=${endDate}`);
            if (response.ok) {
                const searchResults = await response.json();
                timeline.renderTimeline('', searchResults);
            } else {
                throw new Error('Search failed');
            }
        } catch (error) {
            console.error('Error during advanced search:', error);
            showNotification('حدث خطأ أثناء البحث المتقدم. يرجى المحاولة مرة أخرى.', 'error');
        }
    });
});
