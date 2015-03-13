/**
 * Game implementation module responsible for obtaining data from the server.
 * Can make the data up in single-player games.
 */
define(function () {
    'use strict';

    function Client(engine) {
        this.serverUrl = 'data';
        this.allowPartialUpdate = false;
        
        // If some data pre-processing is necessary, just wrap the redraw to a function that will do that.
        this.processData = function (data) {
            
            // Allow partial updates after the client has been initialized (server doesn't know about browser refreshes).
            this.allowPartialUpdate = true;
            engine.redraw(data); 
        }.bind(this);
        this.processDetailedData = engine.processDetailedData.bind(engine);
    }    
    
    Client.prototype.requestData = function (argument, callback) {
        var xmlHttp = new XMLHttpRequest();
        
        xmlHttp.onreadystatechange = function () {
            if ((this.readyState === 4) && (this.status === 200)) {
                var data = JSON.parse(this.responseText);
                callback(data);
            }
        };
        
        // Request data surrounding the current camera position
        xmlHttp.open('GET', this.serverUrl + '/tiles/' + argument, true);
        xmlHttp.setRequestHeader('Content-type', 'application/json');
        
        if(this.allowPartialUpdate) {
            xmlHttp.setRequestHeader('Cache-Control', 'max-age=1');
        }
        
        xmlHttp.send();
    };
    
    /**
     * Obtains data for given coordinate range.
     * Part of the engine interface.
     * 
     * @param {type} range Top left and bottom right corner defining area on the map.
     */
    Client.prototype.getData = function (range) {
        this.requestData(range.join(), this.processData);
    };
    
    /**
     * Obtains detailed data for given coordinate.
     * Part of the engine interface.
     * 
     * @param {type} coordinates The tile to obtain detailed information about.
     */
    Client.prototype.getDetailedData = function (coordinates) {
        this.requestData(coordinates, this.processDetailedData);
    };

    return Client;
});
