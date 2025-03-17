'use strict';

(function () {
    const navbar = {
        breakpointSize: 1024,

        toggle: (element) => {
            const isScrolled = window.scrollY > 0;
            element.classList[isScrolled ? 'add' : 'remove']('border-neutral-200', 'dark:border-neutral-800');
            element.classList[isScrolled ? 'remove' : 'add']('border-transparent', 'dark:border-transparent');
        },

        toggleResponsive: (element) => {
            if (window.innerWidth >= navbar.breakpointSize) {
                const id = element.getAttribute('aria-labelledby');
                const navbarMenu = document.getElementById(id);

                if (!navbarMenu) return;
                navbar.menu.close(navbarMenu);
            }
        },

        menu: {
            open: (element) => {
                element.classList.remove('hidden', 'invisible');
                navbar.menu.forceFocus(element);
                navbar.menu.toggleButton(element.id, true);
                document.body.classList.add("overflow-hidden");

                if (navbar.menu[element.id]) return;
                navbar.menu[element.id] = {
                    clickOutside: (event) => navbar.menu.clickOutsideHandler(element, event),
                    escapeKey: (event) => navbar.menu.escapeKeyHandler(element, event),
                    focusTrap: (event) => navbar.menu.focusTrapHandler(element, event)
                };
                document.addEventListener('click', navbar.menu[element.id].clickOutside);
                window.addEventListener('keydown', navbar.menu[element.id].escapeKey);
                window.addEventListener('keydown', navbar.menu[element.id].focusTrap);
            },

            close: (element) => {
                element.classList.add('hidden', 'invisible');
                navbar.menu.toggleButton(element.id, false);
                document.body.classList.remove("overflow-hidden");

                if (!navbar.menu[element.id]) return;
                document.removeEventListener('click', navbar.menu[element.id].clickOutside);
                window.removeEventListener('keydown', navbar.menu[element.id].escapeKey);
                window.removeEventListener('keydown', navbar.menu[element.id].focusTrap);
                delete navbar.menu[element.id];
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
                    navbar.menu.close(element);
                }
            },
    
            escapeKeyHandler: (element, event) => {
                if (event.key === 'Escape') {
                    navbar.menu.close(element);
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
    }

    const navbarElement = document.getElementById('navbar');
    if (navbarElement) {
        window.addEventListener('scroll', () => {
            navbar.toggle(navbarElement)
        });
        window.addEventListener('load', () => {
            navbar.toggle(navbarElement)
        });
        window.addEventListener('resize', () => {
            navbar.toggleResponsive(navbarElement)
        });
    }

    const navbarMenuOpenButton = document.getElementById('navbar-menu-open-button');
    if (navbarMenuOpenButton) {
        navbarMenuOpenButton.addEventListener('click', () => {
            const id = navbarMenuOpenButton.getAttribute('aria-controls');
            const element = document.getElementById(id);

            if (!element) return;
            navbar.menu.open(element);
        });
    }
    const navbarMenuCloseButton = document.getElementById('navbar-menu-close-button');
    if (navbarMenuCloseButton) {
        navbarMenuCloseButton.addEventListener('click', () => {
            const id = navbarMenuCloseButton.getAttribute('aria-controls');
            const element = document.getElementById(id);

            if (!element) return;
            navbar.menu.close(element);
        });
    }
})();