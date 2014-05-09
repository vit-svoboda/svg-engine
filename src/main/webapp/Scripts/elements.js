/*
 *  Object definitions - later on most likely replaced with svg.js
 *  TODO: transform this to svg.js module.
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
Tile.prototype.constructor = Tile;

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
    sprite.setAttribute('class', 'ImageTile');
    sprite.wrapper = this;
    this.svg = sprite;

    sprite.onclick = function(e) {
        var handler = e.originalTarget.wrapper.onclick;
        if (handler) {
            handler(e);
        }
    };
};


