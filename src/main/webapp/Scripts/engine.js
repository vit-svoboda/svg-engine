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
        var dimension = {
            x: data.tiles.length,
            y: data.tiles[0].length
        };

        console.log('Redrawing to grid of size ' + dimension.x + 'x' + dimension.y + '.');

        // Clear SVG from previous render.
        // TODO: Remove only the elements to be redrawn or reclycle them.
        this.context.clear();

        var tileSize = {
            width: this.context.width() / dimension.x,
            height: this.context.height() / dimension.y
        };

        for (var x = 0; x < dimension.x; x++) {
            for (var y = 0; y < dimension.y; y++) {
                var tileData = $.extend(data.tiles[x][y], tileSize),
                    tile = this.controller.createTile(this.context, tileData);

                // Add user controls handlers.
                tile.click(this.onClick);
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