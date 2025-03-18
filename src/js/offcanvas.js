'use strict';

const overlay = {
    toggle(button, isOpen = null) {
        const id = button.getAttribute('aria-controls');
        const element = document.getElementById(id);
        if (isOpen == null) isOpen = button.getAttribute('aria-expanded') !== 'true';
        if (!element) return;
        isOpen ? this.open(element) : this.close(element);
    },
    open(element) {
        element.classList.remove('hidden', 'invisible');
        element.removeAttribute('inert');
        utility.forceFocus(element);
        this.toggleButton(element.id, true);
        this.addEvents(element);
    },
    close(element) {
        element.classList.add('hidden', 'invisible');
        element.setAttribute('inert', '');
        this.toggleButton(element.id, false);
        this.removeEvents(element)
    },
    toggleButton(id, isOpen) {
        document.querySelectorAll(`[aria-controls="${id}"]`).forEach(button => {
            button.setAttribute('aria-expanded', isOpen);
        });
    },
    addEvents(element) {
        if (this[element.id]) return;
        this[element.id] = {
            clickOutside: (event) => utility.clickOutsideHandler(this, element, event),
            escapeKey: (event) => utility.escapeKeyHandler(this, element, event),
            focusTrap: (event) => utility.focusTrapHandler(element, event),
        };
        document.addEventListener('click', this[element.id].clickOutside);
        window.addEventListener('keydown', this[element.id].escapeKey);
        window.addEventListener('keydown', this[element.id].focusTrap);
    },
    removeEvents(element) {
        if (!this[element.id]) return;
        document.removeEventListener('click', this[element.id].clickOutside);
        window.removeEventListener('keydown', this[element.id].escapeKey);
        window.removeEventListener('keydown', this[element.id].focusTrap);
        delete this[element.id];
    }
}

const utility = {
    forceFocus(element) {
        element.setAttribute('tabindex', 1);
        element.focus();
        setTimeout(() => element.removeAttribute('tabindex'), 100);
    },
    clickOutsideHandler(component, element, event) {
        if (!event.target.closest(`[aria-labelledby="${element.id}"]`) && !event.target.closest(`[aria-controls="${element.id}"]`)) {
            component.close(element);
        }
    },
    escapeKeyHandler(component, element, event) {
        if (event.key === 'Escape') component.close(element);
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
const offcanvasCloseButton = document.getElementById('offcanvas-close-button');

offcanvasOpenButton.addEventListener('click', () => overlay.toggle(offcanvasOpenButton, true));
offcanvasCloseButton.addEventListener('click', () => overlay.toggle(offcanvasCloseButton, false));
