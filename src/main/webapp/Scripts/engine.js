define(['jquery', 'elements'], function($) {
    'use strict';
    
    function Engine(container, controller, serverUrl, refreshSpeed) {
        this.refreshSpeed = refreshSpeed || 1000;
        this.container = container;
        this.controller = controller;
        this.serverUrl = serverUrl;
    }
    Engine.prototype.redraw = function(data) {
        var dimX = data.map.length;
        var dimY = data.map[0].length;

        console.log('Redrawing to grid of size ' + dimX + 'x' + dimY + '.');

        // Clear SVG from previous render. Perhaps standard loop through childElements was faster.
        $('#svg > polygon').remove();
        $('#svg > image').remove();

        var box = this.container[0].getBBox();
        var width = box.width / dimX;
        var height = box.height / dimY;

        var halfScreenWidth = box.width / 2;

        for (var x = 0; x < dimX; x++) {
            for (var y = 0; y < dimY; y++) {
                var tileData = {
                    'content': data.map[x][y],
                    'width': width,
                    'height': height
                };
                var tile = this.controller.getTile(tileData);

                // Information that general engine needs to track about every tile.			
                tile.coordinates = new Point(x, y);

                // Position new element when it's finished;
                tile.center = new Point((x - y) * (width / 2) + halfScreenWidth, (x + y + 1) * (height / 2));

                tile.place(tile.center);

                this.container.append(tile.svg);
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
            xmlHttp.open("GET", this.serverUrl, true);
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