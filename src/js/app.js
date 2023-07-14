/**
 * --------------------------------------------------------------------------
 * Components v0.1.0: app.js
 * Licensed under MIT (https://github.com/mkfizi/components/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

(function () {
    'use strict';

    const app = {};

    app.name = 'Components';
    app.version = '0.1.0';
    app.breakpointSize = 1024;

    app.element = {
        navbar: document.getElementById('navbar'),
        darkModeToggle: document.getElementById('dark-mode-toggle'),
        footerCurrentYear: document.getElementById('footer-year'),
        footerAppName: document.getElementById('footer-app-name'),
        footerAppVersion: document.getElementById('footer-app-version'),
    }
    
    app.view = {
        // Workaround fix to handle viewport height issue on mobile browsers
        viewportHeight: {
            // https://stackoverflow.com/questions/37112218/css3-100vh-not-constant-in-mobile-browser
            toggle: () => {
                document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
            }
        },

        footer: {
            // Toggle footer content with current year, app name and version
            toggle: () => {
                if (app.element.footerCurrentYear) {
                    app.element.footerCurrentYear.innerHTML = new Date().getFullYear();
                }

                if (app.element.footerAppName) {
                    app.element.footerAppName.innerHTML = app.name;
                }
                
                if (app.element.footerAppVersion) {
                    app.element.footerAppVersion.innerHTML = app.version;
                }
            }
        },


        darkMode: {
            // Toggle dark mode
            toggle: () => {
                const isDarkMode = localStorage.theme === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches);
                localStorage.theme = isDarkMode ? 'dark' : 'light';
                document.documentElement.classList.toggle('dark', isDarkMode);
            }
        },

        navbar: {
            // Toggle navbar appearance base on window scroll Y position
            toggle: () => {
                if (app.element.navbar) {
                    const isScrolled = window.scrollY > (app.element.navbar.offsetHeight - app.element.navbar.clientHeight);
                    app.element.navbar.classList[isScrolled? 'add' : 'remove']('border-neutral-200', 'dark:border-neutral-800');
                    app.element.navbar.classList[isScrolled? 'remove' : 'add']('border-transparent', 'dark:border-transparent');
                }
            },
        },

        // Initialize view
        init: () => {
            app.view.viewportHeight.toggle();
            app.view.footer.toggle();
        }
    }

    app.event = {
        document: {
            // Handle document 'click event
            click: event => {
                const targetElement = event.target.closest('[id]');
                if (targetElement) {
                    switch (targetElement.id) {
                        case app.element.darkModeToggle.id:
                            app.view.darkMode.toggle();
                            break;
                    }
                }
            }
        },

        window: {
            // Handle window 'resize' event
            resize: () => {
                app.view.viewportHeight.toggle();
            },

            // Handle window 'scroll' event
            scroll: () => {
                app.view.navbar.toggle();
            }
        },

        init: () => {
            document.addEventListener('click', app.event.document.click);
            window.addEventListener('resize', app.event.window.resize);
            window.addEventListener('scroll', app.event.window.scroll);
        }
    },

    app.init = () => {
        app.view.init();
        app.event.init();
    }

    app.init();
})();