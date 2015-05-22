define(['jquery', 'point', 'datacache', 'camera', 'spritesheet', 'svg', 'svg.tile', 'svg.foreignobject'], function ($, Point, DataCache, Camera, SpriteSheet, SVG) {
    'use strict';

    /**
     * Engine module constructor.
     * @module engine
     * @exports Engine
     * 
     * @param {HTMLElement|jQuery} container Engine will live inside this element.
     * @param {number} refreshSpeed How often the screen should be updated.
     */
    function Engine(container, refreshSpeed) {
        // Make sure container is jQuery object.
        container = $(container);

        if (SVG.supported) {
            this.refreshSpeed = refreshSpeed || 500;

            this.context = SVG(container[0]);

            // Information about logical field of view.
            this.camera = new Camera();
            this.cache = new DataCache();
            this.spritesheet = new SpriteSheet(this.context);

            // Information about actually drawn field of view.
            this.managedElements = this.context.group();
                        
            this.tiles = this.managedElements.group();
            
            // Objects layer is above the ground.
            this.objects = this.managedElements.group();

            this.lastUpdate = 0;

            this.showFPS = false;
            this.lastFrame = 0;
            this.fpsSum = 0;
            this.fpsCount = 0;

            this.resize(container);
        } else {
            // If SVG is not supported, disable engine run.
            this.run = function () {
                container.append('<span>SVG is not supported in this browser.</span>');
            };
        }
    }

    /**
     * Initializes the engine with given game implementation.
     * 
     * @param {Client} client Game data proxy.
     * @param {AssetHandler} assetHandler Game data translation provider.
     * @param {Controller} controller Game logic provider.
     */
    Engine.prototype.init = function (client, assetHandler, controller) {
        this.client = client;
        this.assetHandler = assetHandler;
        this.controller = controller;
    };

    /**
     * Launches the engine update loop. 
     */
    Engine.prototype.run = function () {
        this.lastUpdate = null;

        requestAnimationFrame(this.updateAsync.bind(this));

        this.ui = this.controller.createUi(this.context);
    };
    
    /**
     * Updates the screen with tiles based on given data.
     * 
     * @param {Chunk} data Fresh data for the screen
     */
    Engine.prototype.redraw = function (data) {
        var tileSize = this.camera.getTileSize();
        
        if (data && data.tiles) {
            data.tiles.forEach(function (tileData, y) {
                if (tileData.forEach) {
                    
                    // Full update mode
                    tileData.forEach(function (tile, x) {
                        var position = new Point(data.topLeft.x + x, data.topLeft.y + y);
                        
                        this.updateTile(tile, position, tileSize);
                    }, this);
                } else {
                    
                    // Diff update mode (position object obtained is missing Point logic).
                    this.updateTile(tileData.content, new Point(tileData.position.x, tileData.position.y), tileSize);
                }
            }, this);
            
            this.cache.collectGarbage();
        }
    };

    /**
     * Runs controller callback handling detailed data.
     * 
     * @param {Object} tileData Detailed data obtained from client.
     */
    Engine.prototype.processDetailedData = function (tileData) {
        this.controller.processDetailedData(this.context, tileData);
    };    
    
    /**
     * Obtains an object of given type and places it on given tile.
     * 
     * @param {Object} tile Tile where the object should be placed.
     * @param {Object} objectType Identifier of the object that should be created by assetHandler.
     * @returns {Object} placed object.
     */
    Engine.prototype.placeObject = function (tile, objectType) {
        
        var object = this.assetHandler.createObject(this.objects, objectType),
            tileSize = this.camera.getTileSize(),
            index = this.getObjectOverlapIndex(tile.coordinates);
        
        this.objects.add(object, index);
        
        object.tile(tileSize, object.tallness);
        
        // Add y to compensate for altitude.        
        this.moveObjectOverTile(object, tile);

        tile.objects = tile.objects || [];
        tile.objects.push(object);        
        object.location = tile;
        
        return object;
    };    
    
    /**
     * Places given object on the given tile. The movement can take some time when object speed is specified.
     * 
     * @param {Object} object Object to be moved.
     * @param {Object} tile Target tile.
     * @param {number} speed Object movement speed.
     */
    Engine.prototype.moveObject = function (object, tile, speed) {
        var os = this.objects,
            animationDuration = this.moveObjectOverTile(object, tile, speed);
        
        object.location.objects = object.location.objects.filter(function (i) {
            return i !== object;
        });
        
        // Fix 3D/overlap
        setTimeout(function () {
            os.removeElement(object);
            var index = this.getObjectOverlapIndex(tile.coordinates);
            os.add(object, index);
        }.bind(this), animationDuration / 2);
        
        // At the end set the target tile as the new location
        setTimeout(function () {
            object.location = tile;
            tile.objects = tile.objects || [];
            tile.objects.push(object);
        }, animationDuration);
    };
    
    /**
     * Moves camera by given difference.
     * 
     * @param {number} xDiff Screen pixels horizontally.
     * @param {number} yDiff Screen pixels vertically.
     */
    Engine.prototype.move = function (xDiff, yDiff) {

        var camera = this.camera,
            tileSize = camera.getTileSize(),
            moveAnimationSpeed = 200;

        this.managedElements.animate(moveAnimationSpeed)
                            .dmove(-xDiff, -yDiff);
        
        setTimeout(function () {
                        
            // Get rid of those outside screen.
            this.cache.clear(function (tile) {
                return tile && !camera.showTile(new Point(tile.cx(), tile.cy()), tileSize);
            });
        }.bind(this), moveAnimationSpeed);
        
        camera.move(xDiff, yDiff);
        
        this.fillScreenFromCache(tileSize);
    };
    
    /**
     * Fills currently empty spots on the screen from cache.
     * Typically this is useful after the screen has been moved to some area where content is still cached.
     * 
     * @param {Object} tileSize size of the tile on screen.
     */
    Engine.prototype.fillScreenFromCache = function(tileSize) {
        
        var range = this.camera.getScreenOuterBounds(),
            x, y,
            cacheItem, position, center,
            from = range[0],
            to = range[1];
        
        for (x = from.x; x < to.x; x++) {
            for(y = from.y; y < to.y; y++) {
                
                position = new Point(x, y);
                cacheItem = this.cache.get(position);
                
                if (cacheItem && !cacheItem.tile){
                    center = this.camera.getIsometricCoordinates(position);
                    
                    if (this.camera.showTile(center, tileSize)) {                    
                        this.drawTile(cacheItem.content, position, tileSize, this.camera.getIsometricCoordinates(position));
                    }
                }
            }
        }
    };

    /**
     * Draws a tile on the screen.
     * 
     * @param {Object} content Content of the tile.
     * @param {Point} position Tile logical coordinates.
     * @param {Object} tileSize size of the tile on screen.
     * @param {Point} center of the tile on the screen.
     */
    Engine.prototype.drawTile = function (content, position, tileSize, center) {

        // Draw the actual tile
        var tile = this.assetHandler.createTile(this.tiles, content);
    
        this.tiles.add(tile, 0);

        tile.tile(tileSize);

        tile.coordinates = position;
        
        // So that engine is available in UI handlers.
        tile.engine = this;

        // Add user controls handlers.
        tile.click(this.controller.onClick);

        // Move operates with top left corner, while my center is tile center.
        tile.center(center.x, center.y);

        return tile;
    };

    /**
     * Updates data cache and if the tile needs to be redrawn, returns its coordinates on screen.
     * 
     * @param {Object} tileContent  Content of the tile.
     * @param {Point}  tilePosition Logical coordinates of the tile.
     * @param {Object} tileSize tileSize is optionally passed in to prevent recalculation for each updated tile and hence improve performance.
     */
    Engine.prototype.updateTile = function (tileContent, tilePosition, tileSize) {
        var oldTile = this.cache.get(tilePosition),
            center,
            tile,
            objects;

        // Do something only if the tile changed
        if (!oldTile || !oldTile.tile || oldTile.content !== tileContent) {

            // Reuse old coordinates if possible, otherwise calculate new
            if (oldTile && oldTile.tile) {
                center = new Point(oldTile.tile.cx(), oldTile.tile.cy());
                objects = oldTile.tile.objects;

                // Remove the original tile
                oldTile.tile.remove();
            } else {
                center = this.camera.getIsometricCoordinates(tilePosition);
            }

            tileSize = tileSize || this.camera.getTileSize();

            // Skip tiles that would end up out of the screen
            if (this.camera.showTile(center, tileSize)) {
                tile = this.drawTile(tileContent, tilePosition, tileSize, center);
            }
            
            if (objects) {
                
                // Place old tile's objects on the updated tile.
                objects.forEach(function (o) {
                    o.location = tile;
                });
                tile.objects = objects;
            }

            // Update the data cache
            this.cache.set(tilePosition, tileContent, tile);
        }
    };

    /**
     * Requests data update from the server and when it's delivered, redraws the screen.
     * 
     * @param {DOMHighResTimeStamp} timestamp from the beginning of the animation. In miliseconds, but with decimal precision to 10 microseconds. 
     */
    Engine.prototype.updateAsync = function (timestamp) {
        requestAnimationFrame(this.updateAsync.bind(this));

        if (this.showFPS) {
            this.updateFPS(timestamp);
        }

        // Don't bother server on every frame render.
        if (!this.lastUpdate || (timestamp - this.lastUpdate > this.refreshSpeed)) {
            this.lastUpdate = timestamp;

            try {
                // Never request server URL directly, it's the controller's responsibility.
                this.client.getData(this.camera.getScreenOuterBounds());
            } catch (error) {
                console.log(error);
            }
        } else {
            this.spritesheet.animateSprites(timestamp);
        }
    };
    
    /**
     * Returns index on which the object should be placed in the object collection to achieve correct object overlapping.
     * 
     * @param {Point} coordinates
     */
    Engine.prototype.getObjectOverlapIndex = function (coordinates) {
        var result = null;
        
        this.objects.children()
                    .some(function (i) {
                        var c = i.location.coordinates;
                        if ((c.x + c.y) > (coordinates.x + coordinates.y)) {
                            result = i.position();
                            return true;
                        }
                    });
                    
        return result;
    };
    
    /**
     * Moves given object over selected tile.
     * The height above the tile depends on tile existing objects and current object height.
     * 
     * @param {Object} object To be moved over the given tile.
     * @param {type} tile Target tile
     * @param {type} speed Movement animation speed.
     * @returns {number} Move animation duration according to given speed.
     */
    Engine.prototype.moveObjectOverTile = function (object, tile, speed) {
        var y = tile.cy() - this.getTileObjectsHeight(tile),
            animationDuration = 0;
        
        if (object.tallness) {
            y -= object.tallness / 2;
        }
        
        if (speed > 0) {
            animationDuration = speed * object.location.coordinates.getDistance(tile.coordinates);
            object = object.animate(animationDuration);
        }
        
        object.center(tile.cx(), y);
        
        return animationDuration;
    };
    
    /**
     * Sums height of all objects placed on a tile.
     * 
     * @param {type} tile
     * @returns {number}
     */
    Engine.prototype.getTileObjectsHeight = function (tile) {
        var objects = tile.objects || [],
            sum = 0;
        
        // Add y to compensate for altitude.        
        objects.forEach(function(o) {
            sum += o.tallness || 0;
        });
        
        return sum;
    };

    /**
     * Resizes the viewport according to given container.
     * 
     * @param {HTMLElement|jQuery} container Viewport container defining its size.
     */
    Engine.prototype.resize = function (container) {
        var c = $(container),
            size = new Point(c.innerWidth(), c.innerHeight());

        this.camera.resizeViewport(size);
        this.context.size(size.x, size.y);
    };

    /**
     * Draws average FPS in the top left corner.
     * 
     * @param {type} timestamp passed by requestAnimationFrame callback.
     */
    Engine.prototype.updateFPS = function (timestamp) {
        this.fpsSum += 1000 / (timestamp - this.lastFrame);
        this.lastFrame = timestamp;
        this.fpsCount++;

        var text = (this.fpsSum / this.fpsCount).toFixed(2) + ' FPS';
        if (!this.fps) {
            this.fps = this.context.text(text);
        } else {
            this.fps.text(text);
        }
    };

    return Engine;
});