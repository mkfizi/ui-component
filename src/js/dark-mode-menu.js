'use strict';

const darkMode = {
    theme: '',
    toggle(button) {
        const selectedTheme = button.getAttribute("aria-labelledby")?.replace("theme-", "");
        localStorage.theme = selectedTheme;
        darkMode.updateTheme();
        darkMode.updateButton();
        const dropdownId = button.getAttribute('aria-controls');
        const dropdownElement = document.getElementById(dropdownId);
        if (!dropdownElement) return;
        dropdown.close(dropdownElement);
    }, 
    updateTheme() {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark' || 
            (storedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
            (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        darkMode.theme = storedTheme || '';
    },
    updateButton() {
        if (!darkMode.theme) return;
        const activeClasses = ['bg-neutral-100', 'dark:bg-neutral-800'];
        const inactiveClasses = ['hover:bg-neutral-100', 'dark:hover:bg-neutral-800'];
        document.querySelectorAll('[aria-labelledby^="theme"]').forEach(button => {
            button.classList.remove(...activeClasses);
            button.classList.add(...inactiveClasses);
        })
        const activeButton = document.querySelector(`[aria-labelledby="theme-${darkMode.theme}"]`)
        if (activeButton) {
            activeButton.classList.remove(...inactiveClasses);
            activeButton.classList.add(...activeClasses);
        }
    }
}

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

const darkModeMenuToggleButton = document.getElementById('dark-mode-menu-toggle-button');
const themeLightButton = document.getElementById('theme-light-button');
const themeDarkButton = document.getElementById('theme-dark-button');
const themeSystemButton = document.getElementById('theme-system-button');

darkModeMenuToggleButton.addEventListener('click', () => dropdown.toggle(darkModeMenuToggleButton));
themeLightButton.addEventListener('click', () => darkMode.toggle(themeLightButton));
themeDarkButton.addEventListener('click', () => darkMode.toggle(themeDarkButton));
themeSystemButton.addEventListener('click', () => darkMode.toggle(themeSystemButton));

darkMode.updateTheme();
darkMode.updateButton();