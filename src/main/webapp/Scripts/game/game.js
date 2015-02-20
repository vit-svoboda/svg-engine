define(['jquery', 'engine', 'game/client', 'game/assethandler', 'game/controller'], function($, Engine, Client, AssetHandler, Controller){
   'use strict';
   
   function Game() {
       $(document).ready(function () {
            var engine = new Engine($('#viewport')),
                client = new Client(engine),
                assetHandler = new AssetHandler(engine),
                controller = new Controller(engine);
                
            engine.showFPS = true;
            
            engine.init(client, assetHandler, controller);
            
            assetHandler.defineAssets();
            
            engine.run();
        });
   }
   
   return Game;
});
