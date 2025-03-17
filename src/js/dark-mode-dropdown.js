'use strict';

(function () {
    const dropdown = {
        toggle: (button) => {
            const id = button.getAttribute('aria-controls');
            const element = document.getElementById(id);
            const isOpen = button.getAttribute('aria-expanded') === 'true';

            if (!element) return;
            isOpen ? dropdown.close(element) : dropdown.open(element);
        },

        open: (element) => {
            element.classList.remove('hidden', 'invisible');
            element.removeAttribute('inert');
            dropdown.toggleButton(element.id, true);
            
            if (dropdown[element.id]) return;
            dropdown[element.id] = {
                clickOutside: (event) => dropdown.clickOutsideHandler(element, event),
                escapeKey: (event) => dropdown.escapeKeyHandler(element, event)
            };
            document.addEventListener('click', dropdown[element.id].clickOutside);
            window.addEventListener('keydown', dropdown[element.id].escapeKey);
        },

        close: (element) => {
            element.classList.add('hidden', 'invisible');
            element.setAttribute('inert', '');
            dropdown.toggleButton(element.id, false);

            if (!dropdown[element.id]) return;
            document.removeEventListener('click', dropdown[element.id].clickOutside);
            window.removeEventListener('keydown', dropdown[element.id].escapeKey);
            delete dropdown[element.id];
        },

        toggleButton: (id, isOpen) => {
            document.querySelectorAll(`[aria-controls="${id}"]`).forEach(button => {
                button.setAttribute('aria-expanded', isOpen);
            });
        },

        clickOutsideHandler: (element, event) => {
            if (!event.target.closest(`[id="${element.id}"]`) && !event.target.closest(`[aria-controls="${element.id}"]`)) {
                dropdown.close(element);
            }
        },

        escapeKeyHandler: (element, event) => {
            if (event.key === 'Escape') {
                dropdown.close(element);
            }
        },
    }
    
    const darkMode = {
        theme: '',

        toggle: (button) => {
            const selectedTheme = button.getAttribute("aria-labelledby")?.replace("theme-", "");
            localStorage.theme = selectedTheme;
            darkMode.updateTheme();
            darkMode.updateButton();
            
            const dropdownId = button.getAttribute('aria-controls');
            const dropdownElement = document.getElementById(dropdownId);
            if (dropdownElement) {
                dropdown.close(dropdownElement);
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

        
    }

    darkMode.init();

    const darkModeMenuToggleButton = document.getElementById('dark-mode-menu-toggle-button');
    if (darkModeMenuToggleButton) {
        darkModeMenuToggleButton.addEventListener('click', () => { 
            dropdown.toggle(darkModeMenuToggleButton);
        });
    }

    const themeLightButton = document.getElementById('theme-light-button');
    if (themeLightButton) {
        themeLightButton.addEventListener('click', () => { 
            darkMode.toggle(themeLightButton);
        });
    }

    const themeDarkButton = document.getElementById('theme-dark-button');
    if (themeDarkButton) {
        themeDarkButton.addEventListener('click', () => { 
            darkMode.toggle(themeDarkButton);
        });
    }

    const themeSystemButton = document.getElementById('theme-system-button');
    if (themeSystemButton) {
        themeSystemButton.addEventListener('click', () => { 
            darkMode.toggle(themeSystemButton);
        });
    }
})();