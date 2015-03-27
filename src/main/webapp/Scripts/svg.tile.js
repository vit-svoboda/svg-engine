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
            sprite: function(sprite, location) {
                var foreground, element,
                    index = 0;
                
                if (location) {
                    
                    // TODO: Extend the SVG.js library to allow more precise positioning than front, back, forward and backward and replace this mess with that.
                    this.children()
                        .sort(function (a, b) {
                            var c1 = a.location.coordinates,
                                c2 = b.location.coordinates;
                            return (c1.x + c1.y) - (c2.x + c2.y);
                        })
                        .some(function (i) {
                            var c = i.location.coordinates;
                            if ((c.x + c.y) > (location.x + location.y)) {
                                foreground = i;
                                return true;
                            }
                        });
                        
                    index = foreground ? foreground.position() : null;
                }
                                
                element = this.put(new SVG.Sprite, index).attr('fill', sprite);
                element.tallness = sprite.tallness;
                
                return element;
            }
        }
    });
});

