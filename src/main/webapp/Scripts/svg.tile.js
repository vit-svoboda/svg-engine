/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['svg'], function(SVG) {
    'use strict';
    
    SVG.extend(SVG.Polygon, {
        tile: function(width, height) {
            var vRadius = height / 2,
                hRadius = width / 2,
                points = new SVG.PointArray([
                            [0, -vRadius],
                            [hRadius, 0],
                            [0, vRadius],
                            [-hRadius, 0]
                        ]);

            return this.plot(points);
        }
    });
});

