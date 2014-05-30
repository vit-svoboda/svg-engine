define(['engine', 'jquery'], function(Engine, $) {
    'use strict';

    function Client() {
        $(document).ready(function() {
            var controller = {
                serverUrl: 'data',
                createTile: function(context, content) {   
                    switch(content) {
                        case 1:
                            return context.image('Images/grass.png');
                         
                        case 2:
                            return context.image('Images/sand.png');
                            
                        default:
                            return context.polygon().attr('class', 'Tile');
                    }
                },
                onClick: function(e) {
                    var tile = e.originalTarget.instance;

                    // Draw the flag
                    var center = tile.center;
                    
                    console.log('Placing a flag to ' + center + '.');
                    var flag = tile.doc().polygon('0,0 0,-20 10,-15 0,-10').attr('class', 'Flag');
                    flag.move(center.x, center.y);
                    flag.click(function(e) {
                        $(e.originalTarget).remove();
                    });
                    
                    // TODO: Actually on mouse down place there some temporary item, on mouse up make it permanent.
                    // TODO: Meanwhile ask server whether it can be there and if so, notify it.
                }
            };

            var engine = new Engine($('#viewport'), controller);
            engine.run();
        });
    };
    return Client;
});