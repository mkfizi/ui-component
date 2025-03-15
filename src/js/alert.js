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

    const alertCloseButton = document.getElementById('alert-close-button');
    if (alertCloseButton) {
        alertCloseButton.addEventListener('click', () => { 
            alert.close(alertCloseButton);
        });
    }
})();