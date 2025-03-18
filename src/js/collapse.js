'use strict';

const collapse = {
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
    },
    close(element) {
        element.classList.add('hidden', 'invisible');
        element.setAttribute('inert', '');
        this.toggleButton(element.id, false);
    },
    toggleButton(id, isOpen) {
        document.querySelectorAll(`[aria-controls="${id}"]`).forEach(button => {
            button.setAttribute('aria-expanded', isOpen);
        });
    }
}

const collapseToggleButton = document.getElementById('collapse-toggle-button');
collapseToggleButton.addEventListener('click', () => collapse.toggle(collapseToggleButton));