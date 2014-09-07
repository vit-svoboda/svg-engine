define(['point'], function(Point){
    'use strict';
    
    function Camera(position, baseTileSize) {
        this.position = position || new Point(0, 0);
        this.screenSize = new Point(0, 0);
        
        // TODO: default tile size should be responsibility of the controller providing sprites.
        this.BASE_TILE_SIZE = baseTileSize || 100;
        this.zoom = 1.0;
    }
    
    Camera.prototype.getTileSize = function() {
        var actualSize = this.BASE_TILE_SIZE * this.zoom;
        return {
            width: actualSize,
            height: actualSize / 2
        };
    };
    
    Camera.prototype.getScreenOuterBounds = function() {
        
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
    
    Camera.prototype.resizeViewport = function(size) {
        var newSize = size || new Point(0, 0),
            oldSize = this.screenSize,
            tileSize = this.getTileSize();
    
        this.screenSize = newSize;
        
        // TODO: Implement operators for Point
        this.position.x += (newSize.x - oldSize.x) / tileSize.width;
        this.position.y += (newSize.y - oldSize.y) / tileSize.height;
        
        // Changing isometric offset during the run would undesirably move exiting tiles.
        if (!this.isometricOffset) {
            var aspectRatio = size.x / (size.y * 2);
            this.isometricOffset = new Point(size.x, size.y * aspectRatio);
        }
    };
    
    Camera.prototype.getIsometricCoordinates = function(position) {
        
        var tileSize = this.getTileSize(),
            topLeft = new Point(this.position.x - this.screenSize.x / tileSize.width, this.position.y - this.screenSize.y / tileSize.height),
            p = new Point(position.x - topLeft.x, position.y - topLeft.y),
            isoCoordinates = new Point(Math.round(((p.x - p.y) * tileSize.width + this.isometricOffset.x) / 2),
                                       Math.round(((p.x + p.y - 1) * tileSize.height - this.isometricOffset.y) / 2));
                                       
        return isoCoordinates;
    };
    
    
    Camera.prototype.showTile = function(tileIsoCenter) {
        var ts = this.getTileSize(),
            ss = this.screenSize;
        
        // TODO: Configure the boundaries properly
        return tileIsoCenter.x > -ts.width && tileIsoCenter.y > -ts.height && tileIsoCenter.x < ss.x && tileIsoCenter.y < ss.y;
    };
    
    return Camera;
});