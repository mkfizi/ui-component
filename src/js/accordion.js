'use strict';

(function () {
    const accordion = {
        toggle: (button) => {
            const id = button.getAttribute('aria-controls');
            const element = document.getElementById(id);
            const isOpen = button.getAttribute('aria-expanded') === 'true';

            if (!element) return;

            isOpen ? accordion.close(element) : accordion.open(element);
        },

        open: (element) => {
            element.classList.remove('hidden', 'invisible');
            element.removeAttribute('inert');
            accordion.toggleButton(element.id, true);
            accordion.toggleIcon(element.id, true);
            accordion.triggerAccordion(element);
        },

        close: (element) => {
            element.classList.add('hidden', 'invisible');
            element.setAttribute('inert', '');
            accordion.toggleButton(element.id, false);
            accordion.toggleIcon(element.id, false);
        },

        toggleButton: (id, isOpen) => {
            document.querySelectorAll(`[aria-controls="${id}"]`).forEach(button => {
                button.setAttribute('aria-expanded', isOpen)
            });
        },

        toggleIcon: (id, isOpen) => {
            document.querySelector(`[aria-labelledby="${id}"]`).classList.toggle('rotate-180', isOpen);
        },

        triggerAccordion: (element) => {
            const accordionId = element.getAttribute('aria-labelledby');
            if (accordionId) {
                document.querySelectorAll(`[aria-labelledby="${accordionId}"]`).forEach(otherElement => {
                    if (otherElement !== element) accordion.close(otherElement);
                });
            }
        }
    }

    document.querySelectorAll('[id^="toggle-accordion-button"]').forEach(button => {
        button.addEventListener('click', () => {
            accordion.toggle(button);
        });
    });
})();