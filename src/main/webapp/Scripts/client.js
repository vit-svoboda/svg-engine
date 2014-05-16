define(['engine', 'jquery'], function(Engine, $) {
    'use strict';

    function Client() {
        $(document).ready(function() {
            var controller = {
                serverUrl: 'data',
                createTile: function(context, data) {
                    
                    var tile = (data.content == 1) ? context.image('Images/grass.png') : context.polygon().attr('class', 'Tile');

                    return tile.tile(data);
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
                    
                    // TODO: actually on mouse down place there some temporary item, on mouse up make it permanent and meanwhile ask server whether it can be there and if so, notify it,
                }
            };

            var engine = new Engine($('#viewport'), controller);
            engine.run();
        });
    };
    return Client;
});