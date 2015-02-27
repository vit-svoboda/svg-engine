/**
 * Game implementation module responsible for the game logic and user interaction.
 */
define(['jquery'], function ($) {
    'use strict';
    
    function Controller(engine) {
        this.engine = engine;
    }    
    
    /**
     * User click handler.
     * Part of engine interface.
     * 
     * @param {type} e Click event arguments.
     */
    Controller.prototype.onClick = function (e) {
        var tile = e.currentTarget.instance;
        // Draw the flag
        var center = tile.center;
        console.log('Placing a flag to ' + center + '.');
        var flag = tile.parent.polygon('0,0 0,-20 10,-15 0,-10').attr('class', 'Flag');
        flag.move(center.x, center.y);
        flag.click(function (e) {
            $(e.currentTarget).remove();
        });
        // TODO: Actually on mouse down place there some temporary item, on mouse up make it permanent.
        // TODO: Meanwhile ask server whether it can be there and if so, notify it.
    };    
    
    /**
     * Creates the user interface for particular game implementation.
     * Part of engine interface.
     * 
     * @param {type} context Drawing context.
     * @returns {Array} Elements the UI consists of.
     */
    Controller.prototype.createUi = function (context) {
        
        var ui = context.foreignObject(150, 600),
            engine = this.engine,
            speed = 100,
            toolbar = $('<div class="menu"></div>'),
            up = $('<button type="button" class="arrow up" alt="Up">&#8593;</button>').click(function (e) {
                engine.move(0, -speed);
            }),
            down = $('<button type="button" class="arrow down" alt="Down">&#8595;</button>').click(function (e) {
                engine.move(0, speed);
            }),
            left = $('<button type="button" class="arrow left" alt="Left">&#8592;</button>').click(function (e) {
                engine.move(-speed, 0);
            }),
            right = $('<button type="button" class="arrow right" alt="Right">&#8594;</button>').click(function (e) {
                engine.move(speed, 0);
            });
            
        toolbar.append(left, up, down, right);
        $(ui.node).append(toolbar);
        
        ui.move(context.width() - ui.width() - 30, 30);
        
        return [ui];
    };
    
    return Controller;
});
