'use strict';

(function () {
    const sidebar = {
        breakpointSize: 1024,

        toggleResponsive: (element) => {
            if (window.innerWidth >= sidebar.breakpointSize) {
                sidebar.close(element);
            }
        },
        open: (element) => {
            element.classList.remove('hidden', 'invisible');
            sidebar.forceFocus(element);
            sidebar.toggleButton(element.id, true);
            document.body.classList.add("overflow-hidden");

            if (sidebar[element.id]) return;
            sidebar[element.id] = {
                clickOutside: (event) => sidebar.clickOutsideHandler(element, event),
                escapeKey: (event) => sidebar.escapeKeyHandler(element, event),
                focusTrap: (event) => sidebar.focusTrapHandler(element, event)
            };
            document.addEventListener('click', sidebar[element.id].clickOutside);
            window.addEventListener('keydown', sidebar[element.id].escapeKey);
            window.addEventListener('keydown', sidebar[element.id].focusTrap);
        },

        close: (element) => {
            element.classList.add('hidden', 'invisible');
            sidebar.toggleButton(element.id, false);
            document.body.classList.remove("overflow-hidden");

            if (!sidebar[element.id]) return;
            document.removeEventListener('click', sidebar[element.id].clickOutside);
            window.removeEventListener('keydown', sidebar[element.id].escapeKey);
            window.removeEventListener('keydown', sidebar[element.id].focusTrap);
            delete sidebar[element.id];
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
                sidebar.close(element);
            }
        },

        escapeKeyHandler: (element, event) => {
            if (event.key === 'Escape') {
                sidebar.close(element);
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

    const sidebarElement = document.getElementById('sidebar');
    if (sidebarElement) {
        window.addEventListener('resize', () => {
            sidebar.toggleResponsive(sidebarElement)
        });
    }

    const sidebarOpenButton = document.getElementById('sidebar-open-button');
    if (sidebarOpenButton) {
        sidebarOpenButton.addEventListener('click', () => {
            const id = sidebarOpenButton.getAttribute('aria-controls');
            const element = document.getElementById(id);

            if (!element) return;
            sidebar.open(element);
        });
    }
    const sidebarCloseButton = document.getElementById('sidebar-close-button');
    if (sidebarCloseButton) {
        sidebarCloseButton.addEventListener('click', () => {
            const id = sidebarCloseButton.getAttribute('aria-controls');
            const element = document.getElementById(id);

            if (!element) return;
            sidebar.close(element);
        });
    }
})();