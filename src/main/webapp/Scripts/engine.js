define(['jquery', 'point', 'datacache', 'camera', 'svg', 'svg.tile'], function($, Point, DataCache, Camera, SVG) {
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
            this.camera = new Camera(new Point(35.1, 16.7)),
            this.cache = new DataCache();
    
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

        var tileSize = this.camera.getTileSize(),
            screenSize = this.camera.screenSize,
            offset = this.camera.isometricOffset,
            skippedTiles = 0;
        
        for (var x = 0; x < dimension.x; x++) {
            for (var y = 0; y < dimension.y; y++) {

                var tileData = data.tiles[x][y],
                    tileCoordinates = tileData.position,
                    tileContent = tileData.content,
                    oldTile = this.cache.get(tileCoordinates);

                // Do something only if the tile changed
                if (!oldTile || oldTile.content !== tileContent) {

                    // TODO: Hide this ugly piece of code in a function
                    var center = new Point(Math.round(((x - y) * tileSize.width + offset.x) / 2),
                                           Math.round(((x + y - 1) * tileSize.height - offset.y) / 2));

                    // Skip tiles that would end up out of the screen
                    // TODO: Configure the boundaries properly
                    if (center.x < -tileSize.width || center.y < -tileSize.height || center.x > screenSize.x || center.y > screenSize.y) {
                        skippedTiles++;
                    } else {
                        // Remove the original tile
                        if (oldTile && oldTile.tile) {
                            oldTile.tile.remove();
                        }

                        // Draw the actual tile
                        var tile = this.controller.createTile(this.context, tileContent);

                        tile.tile(tileSize);
                        // TODO: Move back to tile method if possible.
                        tile.coordinates = tileCoordinates;
                        tile.center = center;

                        // Add user controls handlers.
                        tile.click(this.controller.onClick);                        
                        tile.move(center.x, center.y);
                        
                        // TODO: Reorder all tiles infront of this one on the z-index
                    }
                    
                    // Update the data cache
                    this.cache.set(tileCoordinates, tileContent, tile);
                }
            }
        }

        console.log(skippedTiles + ' out of ' + dimension.x * dimension.y + ' tiles were not (re)drawn.');
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
    };
    
    
    Engine.prototype.resize = function(container) {
        var c = $(container),
            size = new Point(c.innerWidth(), c.innerHeight());
        
        this.camera.resizeViewport(size);
        this.context.size(size.x, size.y);
    };

    return Engine;
});