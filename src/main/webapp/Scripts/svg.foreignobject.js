define(['svg'], function(SVG) {
    'use strict';
    
    SVG.ForiegnObject = function() {
        this.constructor.call(this, SVG.create('foreignObject'));
  
        // Store type
        this.type = 'foreignObject';
    };
    
    SVG.ForiegnObject.prototype = new SVG.Shape;
    
    SVG.extend(SVG.Container, {
        foreignObject: function(width, height) {
            return this.put(new SVG.ForiegnObject)
                       .size(width || 100, height || 100);
        }
    });
});

