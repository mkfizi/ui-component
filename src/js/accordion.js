'use strict';

const accordion = {
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
        this.toggleIcon(element.id, true);
        this.triggerAccordion(element);
    },
    close(element) {
        element.classList.add('hidden', 'invisible');
        element.setAttribute('inert', '');
        this.toggleButton(element.id, false);
        this.toggleIcon(element.id, false);
    },
    toggleButton(id, isOpen) {
        document.querySelectorAll(`[aria-controls="${id}"]`).forEach(button => {
            button.setAttribute('aria-expanded', isOpen);
        });
    },
    toggleIcon(id, isOpen) {
        document.querySelector(`[aria-labelledby="${id}"]`).classList.toggle('rotate-180', isOpen);
    },
    triggerAccordion(element) {
        const accordionId = element.getAttribute('aria-labelledby');
        if (accordionId) {
            document.querySelectorAll(`[aria-labelledby="${accordionId}"]`).forEach(otherElement => {
                if (otherElement !== element) this.close(otherElement);
            });
        }
    }
}

const accordionToggleButtons = document.querySelectorAll('[id^="accordion-toggle-button"]');
accordionToggleButtons.forEach(button => {
    button.addEventListener('click', () => accordion.toggle(button));
});