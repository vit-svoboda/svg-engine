define(['engine', 'point'], function (Engine, Point) {

    describe('Engine module', function () {

        describe('Engine manages tiles on the screen.', function () {

            var engine = new Engine(document.body),
                tileData = {
                    position: engine.camera.getOriginalCoordinates(0, 0),
                    content: 0
                },
                changedTileData = {
                    position: engine.camera.getOriginalCoordinates(0, 0),
                    content: 1
                },
                spy;
                
            beforeEach(function () {
                spy = spyOn(engine, 'drawTile').and.returnValue({ center: new Point(0, 0), remove: function() {} });
            });

            it('Updates a tile only for the first time as long as the content stays the same.', function (done) {
                
                engine.updateTile(tileData.content, tileData.position);
                expect(engine.drawTile).toHaveBeenCalled();

                spy.calls.reset();

                engine.updateTile(tileData.content, tileData.position);
                expect(engine.drawTile).not.toHaveBeenCalled();

                spy.calls.reset();
                
                engine.updateTile(changedTileData.content, changedTileData.position);
                expect(engine.drawTile).toHaveBeenCalled();
                
                done();
            });

            describe('Even when the screen has been moved.', function () {
        
                beforeAll(function () {
                    jasmine.clock().install();
                    
                    engine.move(500, 0);
                    
                    jasmine.clock().tick(200);
                    jasmine.clock().uninstall();
                });
        
                it('Does not update a tile when it is outside of the screen.', function (done) {
                    engine.updateTile(tileData.content, tileData.position);
                    
                    expect(engine.drawTile).not.toHaveBeenCalled();
                    
                    done();
                });

                it('Updates a tile in moved screen.', function (done) {
                    var anotherTileData = {
                        position: engine.camera.getOriginalCoordinates(500, 0),
                        content: 0
                    };
                    
                    engine.updateTile(anotherTileData.content, anotherTileData.position);
                    
                    expect(engine.drawTile).toHaveBeenCalled();
                    
                    done();
                });
            });
        });
        
        describe('Engine processes all recieved data', function() {
            var engine = new Engine(document.body),
                spy;
            
            beforeEach(function() {
                spy = spyOn(engine, 'updateTile').and.returnValue();
            });
            
            it('Handles null data.', function (done) {
                    
                engine.redraw(null);
                   
                expect(engine.updateTile).not.toHaveBeenCalled();
                    
                done();
            });
            
            it('Handles full update data.', function (done) {
                var data = {
                    topLeft: new Point(0, 0),
                    tiles: [ [ 1, 1], [ 2, 2] ]
                };
                
                engine.redraw(data);
                
                expect(engine.updateTile.calls.count()).toEqual(4);
                
                done();
            });
            
            it('Handles diff update data.', function (done) {
                engine.redraw({ tiles: [ { }, { }, { } ] });
                
                expect(engine.updateTile.calls.count()).toEqual(3);
                
                done();
            });
        });      
    });
});


