define(function(){
    'use strict';
    
    function DataCache() {
        this.cache = [];
    }
    
    /**
     * Tries to retrieve content for a tile on given coordinates.
     * The result may also contain reference to the actual tile.
     * 
     * @param {Point} coordinates Tile coordinates
     * @returns {object} Object containing tile content definition and possibly reference to the tile as well.
     */
    DataCache.prototype.get = function(coordinates) {
        var row = this.cache[coordinates.x];
        if(!row) {
            return null;
        }
        else{
            return row[coordinates.y];
        }
    };
    
    /**
     * Stores given content and tile reference under given coordinates used as a key
     * 
     * @param {Point} coordinates Tile coordinates
     * @param {int} content Tile content definition
     * @param {SVGElement} tile Tile element reference
     */
    DataCache.prototype.set = function(coordinates, content, tile) {
        var row = this.cache[coordinates.x];
        if (!row) {
            row = this.cache[coordinates.x] = [];
        }
        
        row[coordinates.y] = { content: content, tile: tile };
    };
    
    // TODO: Make sure the cache doesn't grow too large when moving around the 'infinite' map.
    
    return DataCache;
});


