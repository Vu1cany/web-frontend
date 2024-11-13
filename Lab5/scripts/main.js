(function() {
    window.addEventListener('load', function() {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        const statsElement = document.getElementById('load-stats');
        statsElement.textContent = `Время загрузки страницы: ${loadTime} мс`;
    });
})();

(function() {
    window.addEventListener('DOMContentLoaded', function() {
        const menuItems = document.querySelectorAll('nav ul li a');
        const currentPage = `./${document.location.pathname.split('/').pop()}`;
        
        menuItems.forEach((item) => {
            if (item.getAttribute('href') === currentPage) {
                item.classList.add('active');
            }
        });
    });
})();

