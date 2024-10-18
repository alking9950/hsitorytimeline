document.addEventListener('DOMContentLoaded', function() {
    const resetForm = document.getElementById('resetForm');
    const errorMessage = document.getElementById('error-message');

    resetForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;

        try {
            const response = await fetch('http://localhost:3000/api/reset-password-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                showNotification(translations[currentLanguage].password_reset_sent, 'success');
            } else {
                errorMessage.textContent = data.error || translations[currentLanguage].password_reset_error;
            }
        } catch (error) {
            console.error('Error during password reset request:', error);
            errorMessage.textContent = translations[currentLanguage].password_reset_error;
        }
    });
});
