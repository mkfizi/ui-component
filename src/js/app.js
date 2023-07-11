/**
 * --------------------------------------------------------------------------
 * Components v0.1.0: app.js
 * Licensed under MIT (https://github.com/mkfizi/components/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

(function () {
    'use strict';

    const app = {
        name: 'Components',
        version:'0.1.0',

        elements: {
            id: {
                darkMode: {
                    toggle: 'darkmode-toggle'
                }
            },

            node: {
                footer: {
                    year: document.getElementById('footer-year'),
                    appName: document.getElementById('footer-app-name'),
                    appVersion: document.getElementById('footer-app-version'),
                }
            }
        },

        events: {
            document: {
                click: event => {
                    const target = event.target;
                    if (target.closest(`[id=${app.elements.id.darkMode.toggle}]`)) {
                        app.views.darkMode.toggle();
                    }
                }
            },

            window: {
                resize: () => {
                    app.views.viewportHeight.toggle();
                }
            },

            init: () => {
                document.addEventListener('click', app.events.document.click);
                window.addEventListener('resize', app.events.window.resize);
            }
        },

        views: {
            viewportHeight: {
                toggle: () => {
                    document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
                }
            },

            darkMode: {
                toggle: () => {
                    const transitions = document.querySelectorAll('.transition, .transition-all, .transition-colors, .transition-opacity, .transition-shadow, .transition-transform');
                    for (const transition of transitions) {
                        transition.classList.add('transition-none');
                        setTimeout(() => {
                            transition.classList.remove('transition-none');
                        }, 100);
                    }
        
                    const isDarkMode = localStorage.theme === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches);
                    localStorage.theme = isDarkMode ? 'dark' : 'light';
                    document.documentElement.classList.toggle('dark', isDarkMode);
                }
            },

            footer: {
                toggle: () => {
                    if (app.elements.node.footer.year) {
                        app.elements.node.footer.year.innerHTML = new Date().getFullYear();
                    }

                    if (app.elements.node.footer.appName) {
                        app.elements.node.footer.appName.innerHTML = app.name;
                    }
                    if (app.elements.node.footer.appVersion) {
                        app.elements.node.footer.appVersion.innerHTML = app.version;
                    }
                }
            },

            init: () => {
                app.views.viewportHeight.toggle();
                app.views.footer.toggle();
            }
        },

        init: () => {
            app.events.init();
            app.views.init();
        }
    }

    app.init();
})();