define(['jquery', 'point', 'datacache', 'camera', 'svg', 'svg.tile', 'svg.foreignobject'], function($, Point, DataCache, Camera, SVG) {
    'use strict';

    /**
     * Engine module constructor.
     * 
     * @param {HTMLElement or jQuery object} container Engine will live inside this element.
     * @param {Client} controller Game logic and data translation provider.
     * @param {number} refreshSpeed How often the screen should be updated.
     */
    function Engine(container, controller, refreshSpeed) {
        // Make sure container is jQuery object.
        container = $(container);

        if (SVG.supported) {
            this.refreshSpeed = refreshSpeed || 200;

            this.context = SVG(container[0]);
            this.controller = controller;
            
            // Information about logical field of view.
            this.camera = new Camera(new Point(35.1, 16.7));
            this.cache = new DataCache();
            
            // Information about actually drawn field of view.
            this.tiles = this.context.group();

            this.resize(container);
        } else {
            // If SVG is not supported, disable engine run.
            this.run = function() {
                container.append('<span>SVG is not supported in this browser.</span>');
            };
        }
    }

    /**
     * Updates the screen with tiles based on given data.
     * 
     * @param {Chunk} data Fresh data for the screen
     */
    Engine.prototype.redraw = function(data) {
        var dimension = new Point(data.tiles.length, data.tiles[0].length);

        console.log('Redrawing to grid of size ' + dimension.x + 'x' + dimension.y + '.');

        var tileSize = this.camera.getTileSize();
        
        for (var x = 0; x < dimension.x; x++) {
            for (var y = 0; y < dimension.y; y++) {

                var tileData = data.tiles[x][y],
                        tileCoordinates = tileData.position,
                        tileContent = tileData.content,
                        oldTile = this.cache.get(tileCoordinates);

                // Do something only if the tile changed
                if (!oldTile || oldTile.content !== tileContent) {

                    // Reuse old coordinates if possible, otherwise calculate new
                    var center = oldTile && oldTile.tile ? oldTile.tile.center : this.camera.getIsometricCoordinates(tileCoordinates);

                    // Skip tiles that would end up out of the screen
                    if(this.camera.showTile(center)) {
                        // Remove the original tile
                        
                        var oldCoords;
                        if (oldTile && oldTile.tile) {
                            oldCoords = oldTile.tile.center;
                            oldTile.tile.remove();
                        }

                        // Draw the actual tile
                        var tile = this.controller.createTile(this.tiles, tileContent);

                        tile.tile(tileSize);
                        // TODO: Move back to tile method if possible.
                        tile.coordinates = tileCoordinates;
                        tile.center = center;

                        // Add user controls handlers.
                        tile.click(this.controller.onClick);
                        tile.move(center.x, center.y);

                        // TODO: Reorder all tiles infront of this one on the z-index
                        // Keep UI in front of everything
                        for (var i = 0; i < this.ui.length; i++) {
                            this.ui[i].front();
                        }
                    }

                    // Update the data cache
                    this.cache.set(tileCoordinates, tileContent, tile);
                }
            }
        }
    };

    /**
     * Requests data update from the server and when it's delivered, redraws the screen. 
     */
    Engine.prototype.updateAsync = function() {
        var xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = (function(that) {
            return function() {
                if ((this.readyState === 4) && (this.status === 200)) {
                    var data = JSON.parse(this.responseText);
                    that.redraw(data);
                }
            };
        })(this);

        try {
            // Request data surrounding the current camera position
            var screen = this.camera.getScreenOuterBounds();

            xmlHttp.open('GET', this.controller.serverUrl + '/tiles/' + screen.join(), true);
            xmlHttp.setRequestHeader('Content-type', 'application/json');
            xmlHttp.send();
        }
        catch (error) {
            console.log(error);
        }
    };

    /**
     * Launches the engine update loop. 
     */
    Engine.prototype.run = function() {
        this.timer = setInterval((function(that) {
            return function() {
                that.updateAsync();
            };
        })(this), this.refreshSpeed);

        this.ui = this.controller.createUi(this.context);
    };


    Engine.prototype.resize = function(container) {
        var c = $(container),
                size = new Point(c.innerWidth(), c.innerHeight());

        this.camera.resizeViewport(size);
        this.context.size(size.x, size.y);
    };


    Engine.prototype.move = function(xDiff, yDiff) {

        //TODO: Animate move all tiles in vector direction.
        /*this.cache.cache.forEach(function(row) {
            row.forEach(function(i) {
                var tile = i.tile;
                if (tile) {
                    tile.center = new Point(tile.center.x + xDiff, tile.center.y + yDiff);
                    tile.animate().move(tile.center.x, tile.center.y);
                }                
            });
        });*/        
        
        this.tiles.animate(200).move(this.tiles.x() + xDiff, this.tiles.y() + yDiff);
        
        //TODO: Get rid of those outside screen.

        var tileSize = this.camera.getTileSize();

        this.camera.position = new Point(this.camera.position.x + xDiff / tileSize.width, this.camera.position.y + yDiff / tileSize.height);
        
        //TODO: Fetch new in screen from cache.
        
        //TODO: Wait for the update.
    };

    return Engine;
});