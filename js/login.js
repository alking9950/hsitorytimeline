document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('adminToken', data.token);
                window.location.href = 'admin.html';
            } else {
                errorMessage.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
            }
        } catch (error) {
            console.error('Error during login:', error);
            errorMessage.textContent = 'حدث خطأ أثناء تسجيل الدخول';
        }
    });
});
