'use strict';

(function () {
    const darkMode = {
        theme: '',

        toggle: (theme, button) => {
            localStorage.theme = theme;
            darkMode.updateTheme();
            darkMode.updateButton();
            
            const dropdownId = button.getAttribute('aria-controls');
            const dropdownElement = document.getElementById(dropdownId);
            if (dropdownElement) {
                darkMode.dropdown.close(dropdownElement);
            }
        },
        
        updateTheme: () => {
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
        
        updateButton: () => {
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
        },

        init: () => {
            darkMode.updateTheme();
            darkMode.updateButton();
        },

        dropdown: {
            toggle: (button) => {
                const id = button.getAttribute('aria-controls');
                const element = document.getElementById(id);
                const isOpen = button.getAttribute('aria-expanded') === 'true';

                if (!element) return;
                isOpen ? darkMode.dropdown.close(element) : darkMode.dropdown.open(element);
            },

            open: (element) => {
                element.classList.remove('hidden', 'invisible');
                element.removeAttribute('inert');
                darkMode.dropdown.toggleButton(element.id, true);
                
                if (darkMode.dropdown[element.id]) return;
                darkMode.dropdown[element.id] = {
                    clickOutside: (event) => darkMode.dropdown.clickOutsideHandler(element, event),
                    escapeKey: (event) => darkMode.dropdown.escapeKeyHandler(element, event)
                };
                document.addEventListener('click', darkMode.dropdown[element.id].clickOutside);
                window.addEventListener('keydown', darkMode.dropdown[element.id].escapeKey);
            },

            close: (element) => {
                element.classList.add('hidden', 'invisible');
                element.setAttribute('inert', '');
                darkMode.dropdown.toggleButton(element.id, false);

                if (!darkMode.dropdown[element.id]) return;
                document.removeEventListener('click', darkMode.dropdown[element.id].clickOutside);
                window.removeEventListener('keydown', darkMode.dropdown[element.id].escapeKey);
                delete darkMode.dropdown[element.id];
            },

            toggleButton: (id, isOpen) => {
                document.querySelectorAll(`[aria-controls="${id}"]`).forEach(button => {
                    button.setAttribute('aria-expanded', isOpen)
                });
            },

            clickOutsideHandler: (element, event) => {
                if (!event.target.closest(`[aria-labelledby="${element.id}"]`) && !event.target.closest(`[aria-controls="${element.id}"]`)) {
                    darkMode.dropdown.close(element);
                }
            },

            escapeKeyHandler: (element, event) => {
                if (event.key === 'Escape') {
                    darkMode.dropdown.close(element);
                }
            },
        }
    }

    darkMode.init();

    const darkModeDropdownToggleButton = document.getElementById('dark-mode-dropdown-toggle-button');
    if (darkModeDropdownToggleButton) {
        darkModeDropdownToggleButton.addEventListener('click', () => { 
            darkMode.dropdown.toggle(darkModeDropdownToggleButton);
        });
    }

    const themeLightButton = document.getElementById('theme-light-button');
    if (themeLightButton) {
        themeLightButton.addEventListener('click', () => { 
            darkMode.toggle('light', themeLightButton);
        });
    }

    const themeDarkButton = document.getElementById('theme-dark-button');
    if (themeDarkButton) {
        themeDarkButton.addEventListener('click', () => { 
            darkMode.toggle('dark', themeDarkButton);
        });
    }

    const themeSystemButton = document.getElementById('theme-system-button');
    if (themeSystemButton) {
        themeSystemButton.addEventListener('click', () => { 
            darkMode.toggle('system', themeSystemButton);
        });
    }
})();