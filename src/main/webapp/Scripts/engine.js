/*
 *  Object definitions
 */
function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.toString = function() {
    return this.x + ',' + this.y;
};

function Polygon(points, cssClass) {
    this.points = points;
    this.cssClass = cssClass;
}

Polygon.prototype.place = function(target) {
    // Translate logical points to isometric coordinates and move them to desired location.
    this.points.forEach(function(point) {
        point.x = point.x * 1 + target.x;
        point.y = point.y * -1 + target.y;
    });

    // Create actual SVG element and append it to the container.
    var element = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    element.setAttribute('points', this.points.join(' '));
    element.setAttribute('class', this.cssClass);
    element.wrapper = this;
    this.svg = element;
    
    var tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    tooltip.innerHTML = this.coordinates;
    element.appendChild(tooltip);

    element.onclick = function(e) {
        var handler = e.originalTarget.wrapper.onclick;
        if (handler) {
            handler(e);
        }
    };
};

function Tile(width, height, cssClass) {
    var horizontalRadius = width / 2;
    var verticalRadius = height / 2;

    this.points = [new Point(0, -verticalRadius), new Point(horizontalRadius, 0), new Point(0, verticalRadius), , new Point(-horizontalRadius, 0)];
    this.cssClass = cssClass;
}

// Tile inherits Polygon
Tile.prototype = new Polygon();

function Sprite(width, height, imageUrl) {
    this.width = width;
    this.height = height;
    this.imageUrl = imageUrl;
}

Sprite.prototype.place = function(target) {
    var sprite = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    sprite.setAttribute('width', this.width);
    sprite.setAttribute('height', this.height);
    sprite.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', this.imageUrl);
    sprite.setAttribute('x', target.x - this.width / 2);
    sprite.setAttribute('y', target.y - this.height / 2);
    sprite.setAttribute('class', 'ImageTile')
    sprite.wrapper = this;
    this.svg = sprite;

    sprite.onclick = function(e) {
        var handler = e.originalTarget.wrapper.onclick;
        if (handler) {
            handler(e);
        }
    };
};

function Engine(container, controller, serverUrl, refreshSpeed) {
    this.refreshSpeed = refreshSpeed || 1000;
    this.container = container;
    this.controller = controller;
    this.serverUrl = serverUrl;

    this.redraw = function(data) {
        var dimX = data.map.length;
        var dimY = data.map[0].length;

        console.log('Redrawing to grid of size ' + dimX + 'x' + dimY + '.');

        // Clear SVG from previous render. Perhaps standard loop through childElements was faster.
        $('#svg > polygon').remove();
        $('#svg > image').remove();

        var box = container[0].getBBox();
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
                var tile = controller.getTile(tileData);

                // Information that general engine needs to track about every tile.			
                tile.coordinates = new Point(x, y);

                // Position new element when it's finished;
                tile.center = new Point((x - y) * (width / 2) + halfScreenWidth, (x + y + 1) * (height / 2));
                
                tile.place(tile.center);

                container.append(tile.svg);
            }
        }
    };

    this.updateAsync = function() {
        var xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = (function(that) {
            return function() {
                if ((this.readyState == 4) && (this.status == 200)) {
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

    this.run = function() {
        // TODO: Make this a timer when rendering is optimized enough.
        this.timer = setTimeout((function(that) {
            return function() {
                that.updateAsync();
            };
        })(this), this.refreshSpeed);
    };
}