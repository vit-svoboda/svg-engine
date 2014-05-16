/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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
            this.plot(points)
            
            return initMetaData(this, data);;
        }
    });
    
    SVG.extend(SVG.Image, {
        tile: function(data) {
            this.width(data.width).height(data.height);            
            
            return initMetaData(this, data);
        }
    });    
    
    function initMetaData(tile, data) {
        tile.coordinates  = data.position;
        tile.center = {
            x: (tile.coordinates.x - tile.coordinates.y) * (data.width / 2) + tile.doc().width() /2,
            y: (tile.coordinates.x + tile.coordinates.y + 1) * (data.height / 2)
        };
        
        return tile.move(tile.center.x, tile.center.y);
    }
});

