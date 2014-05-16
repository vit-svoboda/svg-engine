define(['engine', 'jquery', 'elements'], function(Engine, $) {
    'use strict';

    function Client() {
        $(document).ready(function() {
            var controller = {
                serverUrl: 'data',
                getTile: function(context, data) {
                    
                    var tile = (data.content == 1)
                            ? context.image('Images/grass.png', data.width, data.height)
                            // TODO: Create svg.js module wrapping tile creation.
                            : context.polygon().tile(data.width, data.height).attr('class', 'Tile');

                    tile.click(this.onClick);

                    return tile;
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