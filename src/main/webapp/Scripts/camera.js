define(['point'], function (Point) {
    'use strict';

    function Camera(position, baseTileSize) {
        this.position = position || new Point(0, 0);
        this.screenSize = new Point(0, 0);
        this.moveTransform = new Point(0, 0);
        this.BASE_TILE_SIZE = baseTileSize || 100;
        this.zoom = 1.0;
        
        this.currentScreenOuterBounds = null;
    }

    /**
     * Calculates size of a tile according to current camera configuration.
     * 
     * @returns {Object} Width and height of a tile.
     */
    Camera.prototype.getTileSize = function () {
        var actualSize = this.BASE_TILE_SIZE * this.zoom;
        return {
            width: actualSize,
            height: actualSize / 2
        };
    };

    /**
     * Calculates the screen outer boundaries in map data coordinates.
     * 
     * @returns {Array} Data range requred to populate the whole screen.
     */
    Camera.prototype.getScreenOuterBounds = function () {

        if (this.currentScreenOuterBounds) {
           return this.currentScreenOuterBounds; 
        }
        var tileSize = this.getTileSize(),
            halfResolution = Math.max(this.screenSize.x / tileSize.width, this.screenSize.y / tileSize.height),
            center = this.position;

        return this.currentScreenOuterBounds = [
            new Point(Math.floor(center.x - halfResolution), Math.floor(center.y - halfResolution)),
            new Point(Math.ceil(center.x + halfResolution), Math.ceil(center.y + halfResolution))
        ];
    };

    /**
     * Repositions the camera according to changed viewport size.
     * 
     * @param {type} size New viewport size
     */
    Camera.prototype.resizeViewport = function (size) {
        var newSize = size || new Point(0, 0),
            oldSize = this.screenSize,
            tileSize = this.getTileSize();

        this.screenSize = newSize;

        this.position.x += (newSize.x - oldSize.x) / tileSize.width;
        this.position.y += (newSize.y - oldSize.y) / tileSize.height;

        // Changing isometric offset during the run would undesirably move exiting tiles.
        if (!this.isometricOffset) {
            var aspectRatio = newSize.x / (newSize.y * 2) || 1;
            this.isometricOffset = new Point(newSize.x / aspectRatio - tileSize.width,
                                             newSize.y * aspectRatio);
        }

        // Reset the screen outer bounds
        this.currentScreenOuterBounds = null;
    };

    /**
     * Calculates screen isometric coordinates (in pixels) according to given map data coordinates (in units).
     * 
     * @param {Point} position Map data coordinates
     * @returns {Point} Isometric coordinates
     */
    Camera.prototype.getIsometricCoordinates = function (position) {
        var tileSize = this.getTileSize(),
            x = position.x,
            y = position.y;

        return new Point(((x - y) * tileSize.width + this.isometricOffset.x) / 2,
                         ((x + y) * tileSize.height - this.isometricOffset.y) / 2);
    };

    /**
     * Calculates map data coordinates from given screen isometric coordinates.
     * 
     * @param {number} x X-axis coordinate on the screen.
     * @param {number} y Y-axis coordinate on the screen.
     * @param {Boolean} ignoreOffset Indicates whether the screen centering offset should be ignored in the calculation
     * @returns {Point} Map data coordinates belonging to provided screen isometric coordinates.
     */
    Camera.prototype.getOriginalCoordinates = function (x, y, ignoreOffset) {
        var ts = this.getTileSize(),
            offsetx = ignoreOffset ? 0 : (-this.isometricOffset.x / 2),
            offsety = ignoreOffset ? 0 : (this.isometricOffset.y / 2),
            isox = (x + offsetx) / ts.width,
            isoy = (y + offsety) / ts.height,
            position = new Point(isoy + isox, isoy - isox);

        return position;
    };

    /**
     * Determines whether a tile of specified size with center on given location
     * is within the viewport.
     * 
     * @param {type} center Tile position.
     * @param {type} tileSize Tile size. Optional, automatically obtained if nothing passed in.
     * @returns {Boolean} True if the specified tile should be displayed.
     */
    Camera.prototype.showTile = function (center, tileSize) {
        if (center) {
            var ss = this.screenSize,
                ts = tileSize || this.getTileSize(),
                p = this.moveTransform;

            return center.x >= p.x - ts.width
                    && center.x <= p.x + ss.x + ts.width
                    && center.y >= p.y - ts.height
                    && center.y <= p.y + ss.y + ts.height;
        }
    };

    /**
     * Moves the camera by given margin.
     * 
     * @param {type} xDiff X-axis position difference (in pixels).
     * @param {type} yDiff Y-axis position difference (in pixels).
     */
    Camera.prototype.move = function (xDiff, yDiff) {
        var logicalDiff = this.getOriginalCoordinates(xDiff, yDiff, true);

        this.position = new Point(this.position.x + logicalDiff.x, this.position.y + logicalDiff.y);

        this.moveTransform.x += xDiff;
        this.moveTransform.y += yDiff;
        
        // Reset the screen outer bounds
        this.currentScreenOuterBounds = null;
    };

    return Camera;
});