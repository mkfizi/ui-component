'use strict';


(function () {
    const modal = {
        open: (element) => {
            element.classList.remove('hidden', 'invisible');
            element.removeAttribute('inert');
            modal.toggleButton(element.id, true);
            
            if (modal[element.id]) return;
            modal[element.id] = {
                clickOutside: (event) => modal.clickOutsideHandler(element, event),
                escapeKey: (event) => modal.escapeKeyHandler(element, event),
                focusTrap: (event) => modal.focusTrapHandler(element, event)
            };
            document.addEventListener('click', modal[element.id].clickOutside);
            window.addEventListener('keydown', modal[element.id].escapeKey);
            window.addEventListener('keydown', modal[element.id].focusTrap);
        },

        close: (element) => {
            element.classList.add('hidden', 'invisible');
            element.setAttribute('inert', '');
            modal.toggleButton(element.id, false);

            if (!modal[element.id]) return;
            document.removeEventListener('click', modal[element.id].clickOutside);
            window.removeEventListener('keydown', modal[element.id].escapeKey);
            window.removeEventListener('keydown', modal[element.id].focusTrap);
            delete modal[element.id];
        },

        toggleButton: (id, isOpen) => {
            document.querySelectorAll(`[aria-controls="${id}"]`).forEach(button => {
                button.setAttribute('aria-expanded', isOpen);
            });
        },

        clickOutsideHandler: (element, event) => {
            if (!event.target.closest(`[aria-labelledby="${element.id}"]`) && !event.target.closest(`[aria-controls="${element.id}"]`)) {
                modal.close(element);
            }
        },

        escapeKeyHandler: (element, event) => {
            if (event.key === 'Escape') {
                modal.close(element);
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
    const modalOpenButton = document.getElementById('modal-open-button');
    if (modalOpenButton) {
        modalOpenButton.addEventListener('click', () => { 
            const id = modalOpenButton.getAttribute('aria-controls');
            const element = document.getElementById(id);

            if (!element) return;
            modal.open(element);
        });
    }

    document.querySelectorAll('[id^="modal-close-button"]').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('aria-controls');
            const element = document.getElementById(id);

            if (!element) return;
            modal.close(element);
        });
    });
})();