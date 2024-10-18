document.addEventListener('DOMContentLoaded', function() {
    const shareUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent('استكشف التسلسل الزمني للتاريخ!');

    document.getElementById('shareTwitter').addEventListener('click', function() {
        window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`, '_blank');
    });

    document.getElementById('shareFacebook').addEventListener('click', function() {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
    });

    document.getElementById('shareWhatsapp').addEventListener('click', function() {
        window.open(`https://api.whatsapp.com/send?text=${shareText} ${shareUrl}`, '_blank');
    });
});
