const translations = {
    'ar': {
        'search': 'بحث',
        'categories': 'الفئات',
        'all': 'الكل',
        'random_event': 'حدث عشوائي',
        'load_more': 'تحميل المزيد',
        'share': 'مشاركة',
        'print': 'طباعة',
        'login': 'تسجيل الدخول',
        'register': 'إنشاء حساب',
        'forgot_password': 'نسيت كلمة المرور؟',
        'username': 'اسم المستخدم',
        'email': 'البريد الإلكتروني',
        'password': 'كلمة المرور',
        'confirm_password': 'تأكيد كلمة المرور',
        'submit': 'إرسال',
        'error_occurred': 'حدث خطأ. يرجى المحاولة مرة أخرى.',
        'reset_password': 'إعادة تعيين كلمة المرور',
        'back_to_login': 'العودة إلى تسجيل الدخول',
        'password_reset_sent': 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.',
        'password_reset_error': 'حدث خطأ أثناء طلب إعادة تعيين كلمة المرور',
        // Add more translations as needed
    },
    'en': {
        'search': 'Search',
        'categories': 'Categories',
        'all': 'All',
        'random_event': 'Random Event',
        'load_more': 'Load More',
        'share': 'Share',
        'print': 'Print',
        'login': 'Login',
        'register': 'Register',
        'forgot_password': 'Forgot Password?',
        'username': 'Username',
        'email': 'Email',
        'password': 'Password',
        'confirm_password': 'Confirm Password',
        'submit': 'Submit',
        'error_occurred': 'An error occurred. Please try again.',
        'reset_password': 'Reset Password',
        'back_to_login': 'Back to Login',
        'password_reset_sent': 'A password reset link has been sent to your email.',
        'password_reset_error': 'An error occurred while requesting a password reset',
        // Add more translations as needed
    }
};

let currentLanguage = 'ar';

function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    updateTranslations();
}

function updateTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = translations[currentLanguage][key] || key;
    });
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', updateTranslations);
