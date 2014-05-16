define(['jquery', 'svg', 'svg.tile'], function($, SVG) {
    'use strict';

    function Engine(container, controller, refreshSpeed) {
        // Make sure container is jQuery object.
        container = $(container);

        if (SVG.supported) {
            this.refreshSpeed = refreshSpeed || 1000;
            this.context = SVG(container[0]).size(container.width(), container.height());
            this.controller = controller;
        } else {
            // If SVG is not supported, disable engine run.
            this.run = function() {
                container.append('<span>SVG is not supported in this browser.</span>');
            };
        }
    }
    Engine.prototype.redraw = function(data) {
        var dimX = data.tiles.length;
        var dimY = data.tiles[0].length;

        console.log('Redrawing to grid of size ' + dimX + 'x' + dimY + '.');

        // Clear SVG from previous render.
        // TODO: Remove only the elements to be redrawn or reclycle them.
        this.context.clear();

        var viewportWidth = this.context.width();
        var width = viewportWidth / dimX;
        var height = this.context.height() / dimY;

        var halfScreenWidth = viewportWidth / 2;

        for (var x = 0; x < dimX; x++) {
            for (var y = 0; y < dimY; y++) {

                var tileData = {'width': width, 'height': height};
                $.extend(tileData, data.tiles[x][y]);
                
                var tile = this.controller.getTile(this.context, tileData);

                // Information that general engine needs to track about every tile.			
                tile.coordinates = new Point(x, y);

                // Position new element when it's finished;
                tile.center = new Point((x - y) * (width / 2) + halfScreenWidth, (x + y + 1) * (height / 2));

                tile.move(tile.center.x, tile.center.y);
            }
        }
    };
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
            xmlHttp.open("GET", this.controller.serverUrl + '/tiles/0,0,50,50', true);
            xmlHttp.setRequestHeader('Content-type', 'application/json');
            xmlHttp.send();
        }
        catch (error) {
            console.log(error);
        }
    };
    Engine.prototype.run = function() {
        // TODO: Make this a timer when rendering is optimized enough.
        this.timer = setTimeout((function(that) {
            return function() {
                that.updateAsync();
            };
        })(this), this.refreshSpeed);
    };

    return Engine;
});