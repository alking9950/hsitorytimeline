document.addEventListener('DOMContentLoaded', function() {
    fetchEventData();
});

async function fetchEventData() {
    try {
        const response = await fetch('http://localhost:3000/api/events');
        const events = await response.json();
        createEventChart(events);
    } catch (error) {
        console.error('Error fetching event data:', error);
    }
}

function createEventChart(events) {
    const categories = {};
    events.forEach(event => {
        if (categories[event.category]) {
            categories[event.category]++;
        } else {
            categories[event.category] = 1;
        }
    });

    const ctx = document.getElementById('eventChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: 'عدد الأحداث لكل فئة',
                data: Object.values(categories),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'عدد الأحداث'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'الفئات'
                    }
                }
            }
        }
    });
}
