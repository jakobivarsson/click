importScripts('node_modules/sw-toolbox/sw-toolbox.js');

toolbox.options.debug = false;

toolbox.precache(['/']);
// toolbox.router.get('/(.*)', toolbox.fastest);
// toolbox.router.get('/(.*)', toolbox.fastest, { origin: 'https://fonts.googleapis.com/' });
toolbox.router.default = toolbox.fastest;
