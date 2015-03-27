define(['svg'], function(SVG) {
    'use strict';
    
    SVG.extend(SVG.Polygon, {
        tile: function(size, height) {
            var vRadius = size.height / 2,
                hRadius = size.width / 2,
                tallness = height || 0,
                points = new SVG.PointArray([
                            [0, -vRadius],
                            [hRadius, 0],
                            [hRadius, tallness],
                            [0, vRadius + tallness],
                            [-hRadius, tallness],
                            [-hRadius, 0]
                        ]);
                        
            return this.plot(points);
        }
    });
    
    SVG.extend(SVG.Image, {
        tile: function(data) {
            return this.width(data.width)
                       .height(data.height);
        }
    });
    
    SVG.Sprite = SVG.invent({
        create: 'polygon',
        inherit: SVG.Polygon,
        construct: {
            sprite: function(sprite) {
                var element = new SVG.Sprite();
                element.attr('fill', sprite);
                element.tallness = sprite.tallness;
                
                return element;
            }
        }
    });
});

