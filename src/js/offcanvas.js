'use strict';

(function () {
    const offcanvas = {
        open: (element) => {
            element.classList.remove('hidden', 'invisible');
            element.removeAttribute('inert');
            offcanvas.toggleButton(element.id, true);
            
            if (offcanvas[element.id]) return;
            offcanvas[element.id] = {
                clickOutside: (event) => offcanvas.clickOutsideHandler(element.id, event),
                escapeKey: (event) => offcanvas.escapeKeyHandler(element.id, event),
                focusTrap: (event) => offcanvas.focusTrapHandler(element.id, event)
            };
            document.addEventListener('click', offcanvas[element.id].clickOutside);
            window.addEventListener('keydown', offcanvas[element.id].escapeKey);
            window.addEventListener('keydown', offcanvas[element.id].focusTrap);
        },

        close: (element) => {
            element.classList.add('hidden', 'invisible');
            element.setAttribute('inert', '');
            offcanvas.toggleButton(element.id, false);

            if (!offcanvas[element.id]) return;
            document.removeEventListener('click', offcanvas[element.id].clickOutside);
            window.removeEventListener('keydown', offcanvas[element.id].escapeKey);
            window.removeEventListener('keydown', offcanvas[element.id].focusTrap);
            delete offcanvas[element.id];
        },

        toggleButton: (id, isOpen) => {
            document.querySelectorAll(`[aria-controls="${id}"]`).forEach(button => {
                button.setAttribute('aria-expanded', isOpen)
            });
        },

        clickOutsideHandler: (id, event) => {
            const element = document.getElementById(id);
            
            if (!element) return;
            if (!event.target.closest(`[aria-labelledby="${id}"]`) && !event.target.closest(`[aria-controls="${id}"]`)) {
                offcanvas.close(element);
            }
        },

        escapeKeyHandler: (id, event) => {
            const element = document.getElementById(id);

            if (!element) return;
            if (event.key === 'Escape') {
                offcanvas.close(element);
            }
        },

        focusTrapHandler: (id, event) => {
            if (event.key === 'Tab') {
                const element = document.getElementById(id);
                if (!element) return;

                const focusableElements = Array.from(element.querySelectorAll('a, button, input, textarea, select, details, [tabindex], [contenteditable="true"]')).filter((focusableElement) => {
                    return focusableElement.offsetParent !== null
                });
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (event.shiftKey && (document.activeElement === firstElement || document.activeElement === document.body)) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (!event.shiftKey && document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }

    document.querySelectorAll('[id^="open-offcanvas-button"]').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('aria-controls');
            const element = document.getElementById(id);

            if (!element) return;
            offcanvas.open(element)
        });
    });
    document.querySelectorAll('[id^="close-offcanvas-button"]').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('aria-controls');
            const element = document.getElementById(id);

            if (!element) return;
            offcanvas.close(element)
        });
    });
})();