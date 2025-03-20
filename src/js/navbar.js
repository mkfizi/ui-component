'use strict';

const breakpointSize = 1024;

const navbar = {
    toggle: (element) => {
        const isScrolled = window.scrollY > 0;
        element.classList[isScrolled ? 'add' : 'remove']('border-neutral-200', 'dark:border-neutral-800');
        element.classList[isScrolled ? 'remove' : 'add']('border-transparent', 'dark:border-transparent');
    },

    toggleResponsive: (element) => {
        if (window.innerWidth >= breakpointSize) {
            overlay.close(element);
            document.body.classList.remove("overflow-hidden");
            element.removeAttribute('inert');
        }
    }
}

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
        document.body.classList.add('overflow-hidden');
        utility.forceFocus(element);
        this.toggleButton(element.id, true);
        this.addEvents(element);
    },
    close(element) {
        element.classList.add('hidden', 'invisible');
        element.setAttribute('inert', '');
        document.body.classList.remove('overflow-hidden');
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
const navbarElement = document.getElementById('navbar');
const navbarMenu = document.getElementById('navbar-menu');
const navbarMenuOpenButton = document.getElementById('navbar-menu-open-button');
const navbarMenuCloseButton = document.getElementById('navbar-menu-close-button');

navbarMenuOpenButton.addEventListener('click', () => overlay.toggle(navbarMenuOpenButton, true));
navbarMenuCloseButton.addEventListener('click', () => overlay.toggle(navbarMenuCloseButton, false));

window.addEventListener('scroll', () => navbar.toggle(navbarElement));
window.addEventListener('load', () => navbar.toggle(navbarElement));
window.addEventListener('resize', () => navbar.toggleResponsive(navbarMenu));