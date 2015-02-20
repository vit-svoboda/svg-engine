define(['jquery', 'engine'], function($, Engine) {
    'use strict';

    function Client() {
        $(document).ready(function() {
            var controller = {
                serverUrl: 'data',
                
                getData: function (range) {
                    var xmlHttp = new XMLHttpRequest(),
                        client = this;
                    
                    xmlHttp.onreadystatechange = function() {
                        if ((this.readyState === 4) && (this.status === 200)) {
                            var data = JSON.parse(this.responseText);
                            client.processData(data);
                        }
                    };

                    // Request data surrounding the current camera position
                    xmlHttp.open('GET', this.serverUrl + '/tiles/' + range.join(), true);
                    xmlHttp.setRequestHeader('Content-type', 'application/json');
                    xmlHttp.send();
                },
                processData: function (data) {
                    
                    // Possible to post-process the obtained data here.
                    
                    engine.redraw(data);
                },
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
            
            engine.showFPS = true;
            
            // Load assets
            var regex = new RegExp('[\\?&]spriteMode=([^&#]*)'),
                results = regex.exec(location.search),
                mode = results ? decodeURIComponent(results[1].replace(/\+/g, " ")) : null;
            
            if(mode === 'gif') {
                engine.spritesheet.load('Images/tiles.gif', 100, 150);
                engine.spritesheet.define('sand', 0, 0);
                engine.spritesheet.define('grass', 0, 50);
                engine.spritesheet.define('concrete', 0, 100);
            } else {
                engine.spritesheet.load('Images/tiles.png', 500, 150);
                engine.spritesheet.define('sand', 0, 0, 5);
                engine.spritesheet.define('grass', 0, 50, 3, 200);
                engine.spritesheet.define('concrete', 0, 100);
            }
            
            engine.run();
        });
    };
    
    return Client;
});