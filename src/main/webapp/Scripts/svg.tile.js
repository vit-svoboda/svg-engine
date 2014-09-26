define(['svg'], function(SVG) {
    'use strict';
    
    SVG.extend(SVG.Polygon, {
        tile: function(data) {
            var vRadius = data.height / 2,
                hRadius = data.width / 2,
                points = new SVG.PointArray([
                            [0, -vRadius],
                            [hRadius, 0],
                            [0, vRadius],
                            [-hRadius, 0]
                        ]);
            return this.plot(points);
        }
    });
    
    SVG.extend(SVG.Image, {
        tile: function(data) {
            return this.width(data.width).height(data.height);
        }
    });
    
    SVG.Sprite = SVG.invent({
        create: 'polygon',
        inherit: SVG.Polygon,
        extend: {
            // Nothing special so far
        },
        construct: {
            sprite: function(sprite/* my 7 parameters */) {
                return this.put(new SVG.Sprite).attr('fill', sprite);
            }
        }
    });
});

