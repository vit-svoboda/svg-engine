define(['point'], function (Point) {
    'use strict';

    function Camera(position, baseTileSize) {
        this.position = position || new Point(0, 0);
        this.screenSize = new Point(0, 0);
        this.moveTransform = new Point(0, 0);

        // TODO: default tile size should be responsibility of the controller providing sprites.
        this.BASE_TILE_SIZE = baseTileSize || 100;
        this.zoom = 1.0;
        
        this.currentScreenOuterBounds = null;
    }

    Camera.prototype.getTileSize = function () {
        var actualSize = this.BASE_TILE_SIZE * this.zoom;
        return {
            width: actualSize,
            height: actualSize / 2
        };
    };

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

    Camera.prototype.getIsometricCoordinates = function (position) {
        var tileSize = this.getTileSize(),
            x = position.x,
            y = position.y;

        return new Point(((x - y) * tileSize.width + this.isometricOffset.x) / 2,
                         ((x + y) * tileSize.height - this.isometricOffset.y) / 2);
    };

    Camera.prototype.getOriginalCoordinates = function (x, y, ignoreOffset) {
        var ts = this.getTileSize(),
            offsetx = ignoreOffset ? 0 : (-this.isometricOffset.x / 2),
            offsety = ignoreOffset ? 0 : (this.isometricOffset.y / 2),
            isox = (x + offsetx) / ts.width,
            isoy = (y + offsety) / ts.height,
            position = new Point(isoy + isox, isoy - isox);

        return position;
    };
    
    Camera.prototype.getTileCenteredCoordinates = function (tileCenter, tileSize, objectHeight) {
        if(!tileSize){
            tileSize = this.getTileSize();
        }
        
        return new Point(tileCenter.x - tileSize.width / 2, tileCenter.y - tileSize.height / 2 - (objectHeight || 0));
    };

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