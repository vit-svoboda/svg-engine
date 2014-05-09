require.config({
    baseUrl: 'Scripts',
    paths: {
        jquery: 'third-party/jquery',
        SVG: 'svg'
    }
});
require(['client'], function(module) {
    new module({ /* parameters */}); 
});