define(function () {
    'use strict';

    function DataCache(cacheLimit) {
        this.cache = [];
        this.currentCacheCount = 0;
        this.currentCacheLimit = cacheLimit || 10000;

        this.garbage = null;
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
            var result = this.getFromDataSet(coordinates, this.cache);
            if (!result && this.garbage) {
                result = this.getFromDataSet(coordinates, this.garbage);
            }
            return result;
        }
    };


    /**
     * Tries to retrieve content for a tile on given coordinates from given data container.
     * 
     * @param {type} coordinates Tile coordinates
     * @param {type} dataSet Data container to serve as a source for the tile content.
     * @returns {Object} Content for the tile or undefined if nothing was found.
     */
    DataCache.prototype.getFromDataSet = function (coordinates, dataSet) {
        var row = dataSet[this.coordinateToIndex(coordinates.x)];
        if (row) {
            return row[this.coordinateToIndex(coordinates.y)];
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

        row[this.coordinateToIndex(coordinates.y)] = { content: content, tile: tile };
        
        this.currentCacheCount++;
    };

    /**
     * Removes all data that pass given predicate.
     * 
     * @param {function} detectGarbage Predicate is true if a data item is considered garbage.
     * @param {Boolean} deleteData False if only tile visual representation should be removed and the actual data is to be kept.
     */
    DataCache.prototype.clear = function (detectGarbage, deleteData) {

        var itemCount;

        this.cache.forEach(function (row, y) {
            itemCount = 0;

            row.forEach(function (item, x) {

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


    /**
     * If the current cache is bigger than the configuration allows, old garbage is removed and the current cache is moved to the garbage.
     * It will be awailable untill the new cache is too big again.
     */
    DataCache.prototype.collectGarbage = function () {
        if (this.currentCacheCount > this.currentCacheLimit) {
            
            delete this.garbage;
            
            this.garbage = this.cache;
            this.cache = [];
            this.currentCacheCount = 0;
        }
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


