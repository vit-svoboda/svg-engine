define(function(){
    'use strict';
    
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    
    Point.prototype.toString = function() {
        return this.x + ',' + this.y;
    };
    
    return Point;
});