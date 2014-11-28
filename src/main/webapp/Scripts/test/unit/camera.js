define(['camera', 'point'], function (Camera, Point) {

    describe('Camera module', function() {
        var camera;
        
        beforeEach(function(){
            camera = new Camera();
            camera.resizeViewport(new Point(2, 2));
        });
        
        it('Shows tiles within viewport.', function(done){

            expect(camera.showTile(new Point(1, 1))).toBeTruthy();
            done();
        });
        
        /*
        it('Shows tiles within moved viewport.', function(done){
            camera.move(10, 10);
            
            expect(camera.showTile(new Point(10, 10))).toBeTruthy();
            done();
        });
        */
    });
});