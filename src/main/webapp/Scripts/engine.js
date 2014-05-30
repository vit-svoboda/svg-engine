define(['jquery', 'point', 'datacache', 'svg', 'svg.tile'], function($, Point, DataCache, SVG) {
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
            this.context = SVG(container[0]).size(container.innerWidth(), container.innerHeight());
            this.controller = controller;
            this.camera = {
                // In data coordinates
                position: {
                    x: 35.1,
                    y: 16.2
                },
                zoom: 1.0
            },
            // TODO: default tile size should be responsibility of the controller providing sprites.
            this.BASE_TILE_SIZE = 100;
            this.cache = new DataCache();
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

        var tileSize = this.getTileSize(),
            aspectRatio = this.context.width() / (this.context.height() * 2),
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
                    var center = new Point(Math.round(((x - y) * tileSize.width + this.context.width()) / 2),
                                           Math.round(((x + y - 1) * tileSize.height - this.context.height() * aspectRatio) / 2 )),
                        tile = null;

                    // Skip tiles that would end up out of the screen
                    // TODO: Configure the boundaries properly
                    if (center.x < -tileSize.width || center.y < -tileSize.height || center.x > this.context.width() || center.y > this.context.height()) {
                        skippedTiles++;
                    } else {
                        // Remove the original tile
                        if (oldTile && oldTile.tile) {
                            oldTile.tile.remove();
                        }

                        // Draw the actual tile
                        tile = this.controller.createTile(this.context, tileContent);

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
            var center = this.camera.position,
                    tileSize = this.getTileSize(),
                    // TODO: The more asymetric aspect ratio, the more data will be wasted since the corners end up outside of the view.
                    halfResolution = Math.max(this.context.width() / tileSize.width, this.context.height() / tileSize.height),
                    screen = [
                        new Point(Math.floor(center.x - halfResolution), Math.floor(center.y - halfResolution)),
                        new Point(Math.ceil(center.x + halfResolution), Math.ceil(center.y + halfResolution))
                    ];

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


    Engine.prototype.getTileSize = function() {
        var actualSize = this.BASE_TILE_SIZE * this.camera.zoom;
        return {
            width: actualSize,
            height: actualSize / 2
        };
    };

    return Engine;
});