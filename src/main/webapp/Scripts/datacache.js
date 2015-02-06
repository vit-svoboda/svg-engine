define(['point'], function (Point) {
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
            var row = this.cache[coordinates.x];
            if (row) {
                return row[coordinates.y];
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
        var row = this.cache[coordinates.x];
        if (!row) {
            row = this.cache[coordinates.x] = [];
        }

        row[coordinates.y] = {content: content, tile: tile};
    };

    // TODO: Make sure the cache doesn't grow too large when moving around the 'infinite' map.
    DataCache.prototype.clear = function (detectGarbage, deleteData) {

        var row, item,
            x, y,
            itemCount;
    
        for (y in this.cache) {
            if (this.cache.hasOwnProperty(y)) {
                row = this.cache[y];

                itemCount = 0;

                for (x in row) {
                    if (row.hasOwnProperty(x)) {
                        item = row[x];

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
                    }
                }

                if (itemCount === 0) {
                    delete this.cache[y];
                }
            }
        }
    };

    return DataCache;
});


