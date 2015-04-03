define(function(){
    'use strict';
    
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    
    Point.prototype.toString = function() {
        return this.x + ',' + this.y;
    };
    
    /**
     * Calculates distance between this point and given other point.
     * 
     * @param {type} otherPoint Destination point
     * @returns {Number} Distance to given point
     */
    Point.prototype.getDistance = function (otherPoint) {
        var x = this.x - otherPoint.x,
            y = this.y - otherPoint.y;
    
        return Math.sqrt(x * x + y * y);
    };
    
    return Point;
});