/**
 * Game implementation responsible for data visual representation translation.
 */
define(function () {
    'use strict';

    function AssetHandler(engine) {
        this.spritesheet = engine.spritesheet;
    }
    
    /**
     * Defines assets for the particular game implementation.
     */
    AssetHandler.prototype.defineAssets = function () {

        // Read from query string whether sprites should be gifs or standard png.
        var regex = new RegExp('[\\?&]spriteMode=([^&#]*)'),
            results = regex.exec(location.search),
            mode = results ? decodeURIComponent(results[1].replace(/\+/g, " ")) : null;

        if (mode === 'gif') {
            this.spritesheet.load('Images/tiles.gif', 100, 150);
            this.spritesheet.define('sand', 0, 0);
            this.spritesheet.define('grass', 0, 50);
            this.spritesheet.define('concrete', 0, 100);
        } else {
            this.spritesheet.load('Images/tiles.png', 500, 150);
            this.spritesheet.define('sand', 0, 0).setupAnimation(5);
            this.spritesheet.define('grass', 0, 50).setupAnimation(3, 200);
            this.spritesheet.define('concrete', 0, 100);
        }
        
        this.spritesheet.load('Images/train.png', 200, 70);
        this.spritesheet.define('vertical-car', 0, 0, 20);
        this.spritesheet.define('horizontal-car', 100, 0, 20);
        
        this.spritesheet.load('Images/building.png', 100, 85);
        this.spritesheet.define('house', 0, 0, 35);
    };

    /**
     * Translates given content to its visual representation.
     * Part of engine interface.
     * 
     * @param {type} context Drawing context.
     * @param {type} content Tile content to be translated.
     * @returns {SVGElement} Tile visual representation.
     */
    AssetHandler.prototype.createTile = function (context, content) {
        switch (content) {
            case 1:
                return context.sprite(this.spritesheet.get('grass'));
            case 2:
                return context.sprite(this.spritesheet.get('sand'));
            case 3:
                return context.sprite(this.spritesheet.get('concrete'));
            default:
                return context.polygon().attr('class', 'Tile');
        }
    };
    
    
    AssetHandler.prototype.createObject = function(context, objectType) {
        return context.sprite(this.spritesheet.get(objectType));
    };
    
    return AssetHandler;
});
