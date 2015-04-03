/**
 * Game implementation module responsible for the game logic and user interaction.
 */
define(['jquery'], function ($) {
    'use strict';
    
    function Controller(engine) {
        this.engine = engine;
        this.dialogCount = 0;
        this.clickAction = null;
    }    
    
    /**
     * User click handler.
     * Part of engine interface.
     * 
     * @param {type} e Click event arguments.
     */
    Controller.prototype.onClick = function (e) {
        var tile = e.currentTarget.instance,
            client = tile.engine.client;
        
        if (client.clickAction) {
            client.clickAction(tile);
        } else {
        
            // TODO: Actually on mouse down place there some temporary item, on mouse up make it permanent.
            // Meanwhile ask server for detailed information.
            client.getDetailedData(tile.coordinates);
        }
    };
    
    Controller.prototype.processDetailedData = function (context, tileData) {

        // TODO: Store all UI in a single overlay foreignObject?
        var controller = this,
            ui = context.foreignObject(300, 300),
            dialog = $('<div class="ui dialog"></div>'),
            close = $('<button style="float:right;">X</button>').click(function (e) {
                $(e.currentTarget).parent().parent().remove();
                controller.dialogCount--;
            }),
            position = $('<span class="dialog-title">[' + tileData.position.x + ',' + tileData.position.y + ']</span>'),
            desc = $('<span></span>').text(tileData.description),
            resources,
            dialogOffset = ++this.dialogCount * 30;
    
        dialog.append(position, close, desc);        
        
        if (tileData.resources) {
            resources = $('<ul></ul>');
            
            $.each(tileData.resources, function(resource, amount) {
                resources.append($('<li></li>').text(resource + ": " + amount));
            });
            
            dialog.append(resources);
        }
        
        $(ui.node).append(dialog);
        
        ui.move(dialogOffset, dialogOffset);
    };
    
    /**
     * Creates the user interface for particular game implementation.
     * Part of engine interface.
     * 
     * @param {type} context Drawing context.
     * @returns {Array} Elements the UI consists of.
     */
    Controller.prototype.createUi = function (context) {
        
        var ui = context.foreignObject(200, 600),
            engine = this.engine,
            speed = 100,
            menu = $('<div class="ui"></div>'),
            up = $('<button type="button" class="arrow up" alt="Up">&#8593;</button>').click(function () {
                engine.move(0, -speed);
            }),
            down = $('<button type="button" class="arrow down" alt="Down">&#8595;</button>').click(function () {
                engine.move(0, speed);
            }),
            left = $('<button type="button" class="arrow left" alt="Left">&#8592;</button>').click(function () {
                engine.move(-speed, 0);
            }),
            right = $('<button type="button" class="arrow right" alt="Right">&#8594;</button>').click(function () {
                engine.move(speed, 0);
            }),
            toolbar = $('<div></div>'),
            building = $('<button type="button" alt="Building">Building</button>').click(function (e) {
                var button = $(e.currentTarget);
                
                if (button.hasClass('selected')) {
                    
                    // Cancel the action on the second click.
                    engine.client.clickAction = null;
                } else {
                    
                    // Cancel any other action.
                    button.siblings().removeClass('selected');
                    
                    engine.client.clickAction = function (tile) {
                        
                        // The action is one-time only.
                        tile.engine.client.clickAction = null;
                        button.removeClass('selected');
                    
                        // Perform the actual action.
                        engine.placeObject(tile, 'vertical-car')
                              .click(function (e) {
                                var car = e.currentTarget.instance;
                        
                                engine.client.clickAction = function(tile) {
                                    engine.moveObject(car, tile, 100);
                                };
                            });
                    };
                }
                button.toggleClass('selected');
            });
            
        toolbar.append(building);
        menu.append(left, up, down, right, toolbar);
        $(ui.node).append(menu);
        
        ui.move(context.width() - ui.width() - 30, 30);
        
        return [ui];
    };
    
    return Controller;
});
