'use strict';

(function () {
    const alert = {
        close: (button) => {
            const id = button.getAttribute('aria-controls');
            const element = document.getElementById(id);
            if (!element) return;
            element.remove();
        }
    }

    document.querySelectorAll('[id^="close-alert-button"]').forEach(button => {
        button.addEventListener('click', () => {
            alert.close(button);
        });
    });
})();