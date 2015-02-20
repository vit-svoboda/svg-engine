/**
 * Game implementation module responsible for obtaining data from the server.
 * Can make the data up in single-player games.
 */
define(function () {
    'use strict';

    function Client(engine) {
        this.serverUrl = 'data';
        
        // If some data pre-processing is necessary, just wrap the redraw to a function that will do that.
        this.processData = engine.redraw.bind(engine);
    }    
    
    /**
     * Obtains data for given coordinate range.
     * Part of the engine interface.
     * 
     * @param {type} range Top left and bottom right corner defining area on the map.
     */
    Client.prototype.getData = function (range) {
        var xmlHttp = new XMLHttpRequest(),
            client = this;
        
        xmlHttp.onreadystatechange = function () {
            if ((this.readyState === 4) && (this.status === 200)) {
                var data = JSON.parse(this.responseText);
                client.processData(data);
            }
        };
        
        // Request data surrounding the current camera position
        xmlHttp.open('GET', this.serverUrl + '/tiles/' + range.join(), true);
        xmlHttp.setRequestHeader('Content-type', 'application/json');
        xmlHttp.send();
    };

    return Client;
});
