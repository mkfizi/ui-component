'use strict';

(function () {
    const app = {};

    app.name = 'UI Component';
    app.version = '1.0.0';

    app.init = () => {
        console.log(app.name);
        console.log(app.version);
    }
    
    app.init();
})();