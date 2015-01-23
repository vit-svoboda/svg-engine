define(['jquery', 'engine'], function($, Engine) {
    'use strict';

    function Client() {
        $(document).ready(function() {
            var controller = {
                serverUrl: 'data',
                createTile: function(context, content) {   
                    switch(content) {
                        case 1:
                            return context.sprite(engine.spritesheet.get('grass'));
                         
                        case 2:
                            return context.sprite(engine.spritesheet.get('sand'));
                            
                        case 3:
                            return context.sprite(engine.spritesheet.get('concrete'));
                            
                        default:
                            return context.polygon().attr('class', 'Tile');
                    }
                },
                onClick: function(e) {
                    var tile = e.currentTarget.instance;

                    // Draw the flag
                    var center = tile.center;
                    
                    console.log('Placing a flag to ' + center + '.');
                    var flag = tile.parent.polygon('0,0 0,-20 10,-15 0,-10').attr('class', 'Flag');
                    flag.move(center.x, center.y);
                    flag.click(function(e) {
                        $(e.currentTarget).remove();
                    });
                    
                    // TODO: Actually on mouse down place there some temporary item, on mouse up make it permanent.
                    // TODO: Meanwhile ask server whether it can be there and if so, notify it.
                },
                createUi: function(context) {
                    var ui = context.foreignObject(150,600),
                        speed = 100,
                        toolbar = $('<div class="menu"></div>'),
                        up = $('<button type="button" class="arrow up" alt="Up">&#8593;</button>').click(function(e) {
                            engine.move(0, -speed);
                        }),
                        down = $('<button type="button" class="arrow down" alt="Down">&#8595;</button>').click(function(e) {
                            engine.move(0, speed);
                        }),
                        left = $('<button type="button" class="arrow left" alt="Left">&#8592;</button>').click(function(e) {
                            engine.move(-speed, 0);
                        }),
                        right = $('<button type="button" class="arrow right" alt="Right">&#8594;</button>').click(function(e) {
                            engine.move(speed, 0);
                        });
                        
                    toolbar.append(left, up, down, right);
                    $(ui.node).append(toolbar);
                    
                    ui.move(context.width() - ui.width() - 30, 30);
                    
                    return [ ui ];
                }
            },
            engine = new Engine($('#viewport'), controller);
            
            // Load assets
            engine.spritesheet.load('Images/tiles.png', 500, 150);
            engine.spritesheet.define('sand', 0, 0, 5);
            engine.spritesheet.define('grass', 0, 50, 3, 200);
            engine.spritesheet.define('concrete', 0, 100);
            
            engine.run();
        });
    };
    
    return Client;
});