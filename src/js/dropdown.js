'use strict';

const dropdown = {
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
        };
        document.addEventListener('click', this[element.id].clickOutside);
        window.addEventListener('keydown', this[element.id].escapeKey);
    },
    removeEvents(element) {
        if (!this[element.id]) return;
        document.removeEventListener('click', this[element.id].clickOutside);
        window.removeEventListener('keydown', this[element.id].escapeKey);
        delete this[element.id];
    }
}

const utility = {
    clickOutsideHandler(component, element, event) {
        if (!event.target.closest(`[aria-labelledby="${element.id}"]`) && !event.target.closest(`[aria-controls="${element.id}"]`)) {
            component.close(element);
        }
    },
    escapeKeyHandler(component, element, event) {
        if (event.key === 'Escape') component.close(element);
    }
} 

const dropdownToggleButton = document.getElementById('dropdown-toggle-button');
dropdownToggleButton.addEventListener('click', () => dropdown.toggle(dropdownToggleButton));