'use strict';

(function () {
    const darkMode = {
        toggle: () => {
            const isDarkMode = localStorage.theme === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches);
            localStorage.theme = isDarkMode ? 'dark' : 'light';
            document.documentElement.classList.toggle('dark', isDarkMode);
        }
    }

    const darkModeToggleButton = document.getElementById('dark-mode-toggle-button');
    if (darkModeToggleButton) {
        darkModeToggleButton.addEventListener('click', () => {
            darkMode.toggle(darkModeToggleButton);
        });
    }
})();