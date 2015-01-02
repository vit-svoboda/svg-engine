define(['point'], function (Point) {
    'use strict';

    function Camera(position, baseTileSize) {
        this.position = position || new Point(0, 0);
        this.screenSize = new Point(0, 0);
        this.moveTransform = new Point(0, 0);

        // TODO: default tile size should be responsibility of the controller providing sprites.
        this.BASE_TILE_SIZE = baseTileSize || 100;
        this.zoom = 1.0;
    }

    Camera.prototype.getTileSize = function () {
        var actualSize = this.BASE_TILE_SIZE * this.zoom;
        return {
            width: actualSize,
            height: actualSize / 2
        };
    };

    Camera.prototype.getScreenOuterBounds = function () {

        // TODO: cache the result
        var tileSize = this.getTileSize(),
            halfResolution = Math.max(this.screenSize.x / tileSize.width, this.screenSize.y / tileSize.height),
            // TODO: working with top left corner would make windows resizing easier.
            // TODO: Would it complicate moving camera to a given object too much?
            center = this.position;

        return [
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
           var aspectRatio = newSize.x / (newSize.y * 2);
            this.isometricOffset = new Point(newSize.x / aspectRatio - tileSize.width,
                                             newSize.y * aspectRatio);
        }

        /*
        // Revert previous screen centering offset
        this.moveTransform.x -= oldSize.x / 2;
        this.moveTransform.y += oldSize.y;

        // Add new screen centering offset
        this.moveTransform.x += newSize.x / 2;
        this.moveTransform.y -= newSize.y;
        */
    };

    Camera.prototype.getTopLeft = function () {
        if (!this.topLeft) {
            var tileSize = this.getTileSize();
            this.topLeft = new Point(this.position.x - this.screenSize.x / tileSize.width, this.position.y - this.screenSize.y / tileSize.height);
        }
        return this.topLeft;
    };

    Camera.prototype.getIsometricCoordinates = function (position) {
        var tileSize = this.getTileSize(),
            topLeft = this.getTopLeft(),
            x = position.x - topLeft.x,
            y = position.y - topLeft.y;

        return new Point((((x - y) * tileSize.width + this.isometricOffset.x) / 2) - this.moveTransform.x,
                         (((x + y) * tileSize.height - this.isometricOffset.y) / 2) - this.moveTransform.y);
    };

    Camera.prototype.getOriginalCoordinates = function (x, y) {
        var ts = this.getTileSize(),
            px = x / (2 * ts.width),
            py = y / ts.height,
            position = new Point(py + px, py - px);

        return position;
    };

    Camera.prototype.showTile = function (center, tileSize) {
        var ss = this.screenSize,
            ts = tileSize || this.getTileSize(),
            p = this.moveTransform;

        return center.x >= p.x - ts.width
            && center.x <= p.x + ss.x + ts.width
            && center.y >= p.y - ts.height
            && center.y <= p.y + ss.y + ts.height;
    };

    Camera.prototype.move = function (xDiff, yDiff) {
        var logicalDiff = this.getOriginalCoordinates(xDiff, yDiff);

        this.position = new Point(this.position.x + logicalDiff.x, this.position.y + logicalDiff.y);
        // Clear top left coordinate so it gets recalculated on next access
        this.topLeft = null;
        this.moveTransform.x += xDiff;
        this.moveTransform.y += yDiff;
    };

    return Camera;
});