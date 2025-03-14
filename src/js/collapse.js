'use strict';

(function () {
    const collapse = {
        toggle: (button) => {
            const id = button.getAttribute('aria-controls');
            const element = document.getElementById(id);
            const isOpen = button.getAttribute('aria-expanded') === 'true';

            if (!element) return;

            isOpen ? collapse.close(element) : collapse.open(element);
        },

        open: (element) => {
            element.classList.remove('hidden', 'invisible');
            element.removeAttribute('inert');
            collapse.toggleButton(element.id, true);
        },

        close: (element) => {
            element.classList.add('hidden', 'invisible');
            element.setAttribute('inert', '');
            collapse.toggleButton(element.id, false);
        },

        toggleButton: (id, isOpen) => {
            document.querySelectorAll(`[aria-controls="${id}"]`).forEach(button => {
                button.setAttribute('aria-expanded', isOpen)
            });
        },
    }

    document.querySelectorAll('[id^="toggle-collapse-button"]').forEach(button => {
        button.addEventListener('click', () => {
            collapse.toggle(button);
        });
    });
})();