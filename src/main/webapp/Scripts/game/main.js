require.config({
    baseUrl: 'Scripts',
    paths: {
        jquery: 'third-party/jquery',
        svg: 'third-party/svg'
    }
});

require(['game/game'], function(module) {
    new module({ /* parameters */}); 
});