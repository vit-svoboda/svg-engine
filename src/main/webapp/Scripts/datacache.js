define(function () {
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
    DataCache.prototype.get = function (coordinates) {
        if (coordinates) {
            var row = this.cache[this.coordinateToIndex(coordinates.x)];
            if (row) {
                return row[this.coordinateToIndex(coordinates.y)];
            }
        }
    };

    /**
     * Stores given content and tile reference under given coordinates used as a key
     * 
     * @param {Point} coordinates Tile coordinates
     * @param {int} content Tile content definition
     * @param {SVGElement} tile Tile element reference
     */
    DataCache.prototype.set = function (coordinates, content, tile) {
        var xIndex = this.coordinateToIndex(coordinates.x),
            row = this.cache[xIndex];
        if (!row) {
            row = this.cache[xIndex] = [];
        }

        row[this.coordinateToIndex(coordinates.y)] = {content: content, tile: tile};
    };

    // TODO: Make sure the cache doesn't grow too large when moving around the 'infinite' map.
    DataCache.prototype.clear = function (detectGarbage, deleteData) {

        var itemCount;
    
        this.cache.forEach(function(row, y) {
            itemCount = 0;

            row.forEach(function(item, x) {
                
                itemCount++;

                if (detectGarbage(item.tile)) {

                    if (deleteData) {
                        itemCount--;
                        delete row[x];
                    } else {
                        item.tile.remove();
                        delete item.tile;
                    }                
                }

                if (itemCount === 0) {
                    delete this.cache[y];
                }
            }, this);
        }, this);
    };
    
    
    /*
     * Translates positive coordinates to even numbers and negative coordinates to odd numbers.
     * Just like both ends infinite touring machine tape.
     * 
     * @param {int} coordinate Logical data coordinate.
     */
    DataCache.prototype.coordinateToIndex = function (coordinate) {
        
        var index = coordinate * 2;        
        if (coordinate < 0) {
            index = -index - 1;
        }
        
        return index;
    };

    return DataCache;
});


