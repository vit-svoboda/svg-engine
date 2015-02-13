define(['datacache', 'point'], function (DataCache, Point) {

    describe('DataCache module', function () {

        describe('DataCache can store discontinuous data.', function () {
            
            // Initialize some data in the cache.
            var cache = new DataCache(),
                firstContent = 0,
                secondPosition = new Point(-100, -100),
                secondContent = 1,
                thirdPosition = new Point(1, 1000),
                thirdContent = 1000;

                cache.set(new Point(0, 0), firstContent);
                cache.set(secondPosition, secondContent, { center: secondPosition });
                cache.set(thirdPosition, thirdContent, null);
            
            it('Obtains correct values.', function (done) {

                expect(cache.get(new Point(0, 0))).toEqual({ content: 0, tile: undefined });
                expect(cache.get(secondPosition)).toEqual({ content: 1, tile: { center: secondPosition } });
                expect(cache.get(thirdPosition)).toEqual({ content: 1000, tile: null });

                done();
            });
            
            it('Handles missing values.', function (done) {
                
                expect(cache.get(new Point(1, 0))).toBeUndefined();
                expect(cache.get(new Point(2, 1000))).toBeUndefined();
                expect(cache.get(null)).toBeUndefined();
                
                done();
            });
        });
        
        
        describe('DataCache can handle negative coordinates.', function () {
            
            it('Translates integers to non-negative ones.', function (done) {
                var cache = new DataCache();
                
                expect(cache.coordinateToIndex(0)).toEqual(0);
                expect(cache.coordinateToIndex(1)).toEqual(2);
                expect(cache.coordinateToIndex(2)).toEqual(4);
                expect(cache.coordinateToIndex(3)).toEqual(6);
                expect(cache.coordinateToIndex(4)).toEqual(8);
                expect(cache.coordinateToIndex(5)).toEqual(10);
                
                expect(cache.coordinateToIndex(-1)).toEqual(1);
                expect(cache.coordinateToIndex(-2)).toEqual(3);
                expect(cache.coordinateToIndex(-3)).toEqual(5);
                expect(cache.coordinateToIndex(-4)).toEqual(7);
                expect(cache.coordinateToIndex(-5)).toEqual(9);
                
                expect(cache.coordinateToIndex(10000)).toEqual(20000);
                expect(cache.coordinateToIndex(-10000)).toEqual(19999);
                
                done();
            });
            
            
            it('Seemlesly hides the index translation to the caller.', function (done) {
               var cache = new DataCache();
               
               cache.set(new Point(0, 0), 'Zero center');
               cache.set(new Point(-1, -1), 'All negative');
               cache.set(new Point(-1, 2), 'First negative');
               cache.set(new Point(3, -2), 'Latter negative');
               cache.set(new Point(1, 4), 'Both positive');
               
               expect(cache.get(new Point(0, 0)).content).toEqual('Zero center');
               expect(cache.get(new Point(-1, -1)).content).toEqual('All negative');
               expect(cache.get(new Point(-1, 2)).content).toEqual('First negative');
               expect(cache.get(new Point(3, -2)).content).toEqual('Latter negative');
               expect(cache.get(new Point(1, 4)).content).toEqual('Both positive');
               
               cache.set(new Point(-1, -1), 'Updated');
               
               expect(cache.get(new Point(-1, -1)).content).toEqual('Updated');
               
               done();
            });
        });
            
        describe('DataCache can limit data growth.', function () {
            
            var cache,
                tileToBeRemoved = { isGarbage: true, remove: function() {} },
                tileToBeKept = { isGarbage: false, remove: function() {} };
            
            beforeEach(function () {
                
                spyOn(tileToBeRemoved, 'remove');
                spyOn(tileToBeKept, 'remove');
                
                cache = new DataCache();
                cache.set(new Point(0, 1), 0, tileToBeKept);
                cache.set(new Point(1000, -1), 0, tileToBeRemoved);
            });
            
            it ('Removes specified tiles on demand.', function (done) {
                cache.clear(function(tile) { return tile.isGarbage; });
                
                expect(tileToBeRemoved.remove).toHaveBeenCalled();
                expect(tileToBeKept.remove).not.toHaveBeenCalled();
                
                expect(cache.get(new Point(1000, -1)).tile).toBeUndefined();
                expect(cache.get(new Point(0, 1)).tile).toEqual(tileToBeKept);
                
                done();
            });
            
            it('Removes whole specified records on demand.', function (done) {
                cache.clear(function (tile) { return tile.isGarbage; }, true);
                
                expect(cache.get(new Point(1000, -1))).toBeUndefined();
                expect(cache.cache.filter(function(v) { return v !== undefined; }).length).toEqual(1);
                
                done();
            });
        });
    });
});


