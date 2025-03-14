'use strict';

(function () {
    const modal = {
        open: (element) => {
            element.classList.remove('hidden', 'invisible');
            element.removeAttribute('inert');
            modal.toggleButton(element.id, true);
            
            if (modal[element.id]) return;
            modal[element.id] = {
                clickOutside: (event) => modal.clickOutsideHandler(element.id, event),
                escapeKey: (event) => modal.escapeKeyHandler(element.id, event),
                focusTrap: (event) => modal.focusTrapHandler(element.id, event)
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
                button.setAttribute('aria-expanded', isOpen)
            });
        },

        clickOutsideHandler: (id, event) => {
            const element = document.getElementById(id);
            
            if (!element) return;
            if (!event.target.closest(`[aria-labelledby="${id}"]`) && !event.target.closest(`[aria-controls="${id}"]`)) {
                modal.close(element);
            }
        },

        escapeKeyHandler: (id, event) => {
            const element = document.getElementById(id);

            if (!element) return;
            if (event.key === 'Escape') {
                modal.close(element);
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

    document.querySelectorAll('[id^="open-modal-button"]').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('aria-controls');
            const element = document.getElementById(id);

            if (!element) return;
            modal.open(element)
        });
    });

    document.querySelectorAll('[id^="close-modal-button"]').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('aria-controls');
            const element = document.getElementById(id);

            if (!element) return;
            modal.close(element)
        });
    });
})();