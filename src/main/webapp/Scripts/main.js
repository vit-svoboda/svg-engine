require.config({
    baseUrl: 'Scripts',
    paths: {
        jquery: 'third-party/jquery',
        svg: 'third-party/svg'
    }
});
require(['client'], function(module) {
    new module({ /* parameters */}); 
});