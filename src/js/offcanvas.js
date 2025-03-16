'use strict';

(function () {
    const offcanvas = {
        open: (element) => {
            element.classList.remove('hidden', 'invisible');
            element.removeAttribute('inert');
            offcanvas.toggleButton(element.id, true);
            
            if (offcanvas[element.id]) return;
            offcanvas[element.id] = {
                clickOutside: (event) => offcanvas.clickOutsideHandler(element, event),
                escapeKey: (event) => offcanvas.escapeKeyHandler(element, event),
                focusTrap: (event) => offcanvas.focusTrapHandler(element, event)
            };
            document.addEventListener('click', offcanvas[element.id].clickOutside);
            window.addEventListener('keydown', offcanvas[element.id].escapeKey);
            window.addEventListener('keydown', offcanvas[element.id].focusTrap);
        },

        close: (element) => {
            element.classList.add('hidden', 'invisible');
            element.setAttribute('inert', '');
            offcanvas.forceFocus(element);
            offcanvas.toggleButton(element.id, false);

            if (!offcanvas[element.id]) return;
            document.removeEventListener('click', offcanvas[element.id].clickOutside);
            window.removeEventListener('keydown', offcanvas[element.id].escapeKey);
            window.removeEventListener('keydown', offcanvas[element.id].focusTrap);
            delete offcanvas[element.id];
        },

        toggleButton: (id, isOpen) => {
            document.querySelectorAll(`[aria-controls="${id}"]`).forEach(button => {
                button.setAttribute('aria-expanded', isOpen);
            });
        },

        forceFocus: (element) => {
            element.setAttribute('tabindex', 1);
            element.focus();
            setTimeout(() => {
                element.removeAttribute('tabindex');
            }, 100);
        },

        clickOutsideHandler: (element, event) => {
            if (!event.target.closest(`[aria-labelledby="${element.id}"]`) && !event.target.closest(`[aria-controls="${element.id}"]`)) {
                offcanvas.close(element);
            }
        },

        escapeKeyHandler: (element, event) => {
            if (event.key === 'Escape') {
                offcanvas.close(element);
            }
        },

        focusTrapHandler: (element, event) => {
            if (event.key === 'Tab') {
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

    const offcanvasOpenButton = document.getElementById('offcanvas-open-button');
    if (offcanvasOpenButton) {
        offcanvasOpenButton.addEventListener('click', () => { 
            const id = offcanvasOpenButton.getAttribute('aria-controls');
            const element = document.getElementById(id);

            if (!element) return;
            offcanvas.open(element);
        });
    }

    const offcanvasCloseButton = document.getElementById('offcanvas-close-button');
    if (offcanvasCloseButton) {
        offcanvasCloseButton.addEventListener('click', () => { 
            const id = offcanvasCloseButton.getAttribute('aria-controls');
            const element = document.getElementById(id);

            if (!element) return;
            offcanvas.close(element);
        });
    }
})();