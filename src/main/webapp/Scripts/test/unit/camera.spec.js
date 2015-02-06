define(['camera', 'point'], function (Camera, Point) {

    describe('Camera module', function () {

        describe('Camera can decide whether to show an object or not on unit screen.', function () {
            var camera;

            beforeEach(function () {
                camera = new Camera(new Point(0, 0), 1);
                camera.resizeViewport(new Point(1, 1));
            });
            
            it('Handles null input.', function(done) {
               expect(camera.showTile(null)).toBeUndefined();
               done();
            });            

            it('Shows tiles within viewport.', function (done) {

                expect(camera.showTile(new Point(0, 0))).toBeTruthy();
                expect(camera.showTile(new Point(1, 1))).toBeTruthy();
                done();
            });

            it('Shows tiles within moved viewport.', function (done) {
                camera.move(10, 10);

                expect(camera.showTile(new Point(10, 10))).toBeTruthy();
                expect(camera.showTile(new Point(11, 11))).toBeTruthy();
                done();
            });

            it('Hides tiles outside of viewport.', function (done) {
                expect(camera.showTile(new Point(-2, -1.5))).toBeFalsy();
                expect(camera.showTile(new Point(-2, 0))).toBeFalsy();
                expect(camera.showTile(new Point(0, -1.5))).toBeFalsy();
                expect(camera.showTile(new Point(1, 2.5))).toBeFalsy();
                expect(camera.showTile(new Point(3, 1))).toBeFalsy();
                expect(camera.showTile(new Point(3, 2.5))).toBeFalsy();
                done();
            });

            it('Hides tiles outside of a moved viewport.', function (done) {
                camera.move(10, 10);

                expect(camera.showTile(new Point(8, 8.5))).toBeFalsy();
                expect(camera.showTile(new Point(8, 10))).toBeFalsy();
                expect(camera.showTile(new Point(10, 8.5))).toBeFalsy();
                expect(camera.showTile(new Point(11, 12.5))).toBeFalsy();
                expect(camera.showTile(new Point(13, 11))).toBeFalsy();
                expect(camera.showTile(new Point(13, 12.5))).toBeFalsy();
                done();
            });
        });

        describe('Camera can decide whether to show an object or not.', function () {
            var camera;

            beforeEach(function () {
                camera = new Camera(new Point(0, 0), 10);
                camera.resizeViewport(new Point(50, 30));
            });

            it('Shows tiles within viewport.', function (done) {
                expect(camera.showTile(new Point(0, 0))).toBeTruthy();
                expect(camera.showTile(new Point(50, 0))).toBeTruthy();
                expect(camera.showTile(new Point(0, 30))).toBeTruthy();
                expect(camera.showTile(new Point(50, 30))).toBeTruthy();

                expect(camera.showTile(new Point(25, 15))).toBeTruthy();
                done();
            });

            it('Hides tiles outside of viewport.', function (done) {
                expect(camera.showTile(new Point(-11, 0))).toBeFalsy();
                expect(camera.showTile(new Point(0, -11))).toBeFalsy();
                expect(camera.showTile(new Point(61, 0))).toBeFalsy();
                expect(camera.showTile(new Point(0, 41))).toBeFalsy();
                done();
            });

            it('Shows tiles within a moved viewport.', function (done) {
                camera.move(-500, 0);
                
                expect(camera.showTile(new Point(-500, 0))).toBeTruthy();
                expect(camera.showTile(new Point(-500 + 50, 0))).toBeTruthy();
                expect(camera.showTile(new Point(-500, 30))).toBeTruthy();
                expect(camera.showTile(new Point(-500 + 50, 30))).toBeTruthy();

                expect(camera.showTile(new Point(-500 + 25, 15))).toBeTruthy();
                done();
            });

            it('Hides tiles outside of a moved viewport.', function (done) {
                camera.move(-500);
                
                expect(camera.showTile(new Point(-500 - 11, 0))).toBeFalsy();
                expect(camera.showTile(new Point(-500, -11))).toBeFalsy();
                expect(camera.showTile(new Point(-500 + 50, 0))).toBeFalsy();
                expect(camera.showTile(new Point(-500, 41))).toBeFalsy();
                done();
            });
        });

        describe('Camera can transform coordinates back and forth.', function () {
            var camera;

            beforeEach(function () {
                camera = new Camera(new Point(0, 0), 1);
            });

            it('Transforms coordinates according to expectations in the unit screen', function () {
                camera.resizeViewport(new Point(1, 1));

                expect(camera.getIsometricCoordinates(new Point(0, 0))).toEqual(new Point(0.5, -0.25));
                expect(camera.getIsometricCoordinates(new Point(0, 1))).toEqual(new Point(0, 0));
                expect(camera.getIsometricCoordinates(new Point(1, 0))).toEqual(new Point(1, 0));
                expect(camera.getIsometricCoordinates(new Point(1, 1))).toEqual(new Point(0.5, 0.25));
            });

            it('Decides how much data it needs to fill the screen.', function () {
                camera.resizeViewport(new Point(3, 3));

                expect(camera.getScreenOuterBounds()).toEqual([new Point(-3, 0), new Point(9, 12)]);
            });

            it('Transforms logical coordinates to isometric and back consistently.', function (done) {
                camera.resizeViewport(new Point(5, 3));

                var logical, isometric;

                logical = new Point(0, 0);
                isometric = camera.getIsometricCoordinates(logical);
                expect(camera.getOriginalCoordinates(isometric.x, isometric.y)).toEqual(logical);

                logical = new Point(1, 1);
                isometric = camera.getIsometricCoordinates(logical);
                expect(camera.getOriginalCoordinates(isometric.x, isometric.y)).toEqual(logical);

                logical = new Point(3.14159, 2.71828);
                isometric = camera.getIsometricCoordinates(logical);
                expect(camera.getOriginalCoordinates(isometric.x, isometric.y)).toEqual(logical);
                done();
            });

            it('Transforms isometric coordinates to logical and back consistently.', function (done) {
                camera.resizeViewport(new Point(5, 3));

                var logical, isometric;

                isometric = new Point(0, 0);
                logical = camera.getOriginalCoordinates(isometric.x, isometric.y);
                expect(camera.getIsometricCoordinates(logical)).toEqual(isometric);

                isometric = new Point(1, 1);
                logical = camera.getOriginalCoordinates(isometric.x, isometric.y);
                expect(camera.getIsometricCoordinates(logical)).toEqual(isometric);

                isometric = new Point(3.14159, 2.71828);
                logical = camera.getOriginalCoordinates(isometric.x, isometric.y);
                expect(camera.getIsometricCoordinates(logical)).toEqual(isometric);

                done();
            });

            it('Transforms logical coordinates to isometric correctly.', function (done) {
                camera.resizeViewport(new Point(5, 3));

                // First tile is  moved above the center due to the offset
                expect(camera.getIsometricCoordinates(new Point(0, 0))).toEqual(new Point(2.5, -1.25));
                expect(camera.getIsometricCoordinates(new Point(1, 0))).toEqual(new Point(3, -1));
                expect(camera.getIsometricCoordinates(new Point(0, 1))).toEqual(new Point(2, -1));
                expect(camera.getIsometricCoordinates(new Point(1, 1))).toEqual(new Point(2.5, -0.75));

                // Corners of the screen are populated with with additionaly obtained tiles
                expect(camera.getIsometricCoordinates(new Point(0, 5))).toEqual(new Point(0, 0));
                expect(camera.getIsometricCoordinates(new Point(6, 11))).toEqual(new Point(0, 3));

                // Top right corner is not moved by this transformation!
                expect(camera.getIsometricCoordinates(new Point(5, 0))).toEqual(new Point(5, 0));
                expect(camera.getIsometricCoordinates(new Point(11, 6))).toEqual(new Point(5, 3));

                // Remaining corners of the area required to populate the whole screen with tiles
                expect(camera.getIsometricCoordinates(new Point(11, 0))).toEqual(new Point(8, 1.5));
                expect(camera.getIsometricCoordinates(new Point(0, 11))).toEqual(new Point(-3, 1.5));
                expect(camera.getIsometricCoordinates(new Point(11, 11))).toEqual(new Point(2.5, 4.25));

                done();
            });
            
            it('Transforms logical coordinates to isometric correctly in moved viewport.', function(done) {
               camera.resizeViewport(new Point(5, 3));
               camera.move(-500, -100);
               
               var expected = new Point(2.5, -1.25);
               expect(camera.getIsometricCoordinates(new Point(0, 0))).toEqual(expected);
               
               var expected = new Point(-500, -100);
               expect(camera.getIsometricCoordinates(new Point(-700, 305))).toEqual(expected);
               done();
            });
        });

        describe('Camera can be moved.', function () {

            it('Points to the target logical coordinates.', function (done) {
                var camera = new Camera(new Point(0, 0), 1);
                camera.resizeViewport(new Point(0, 0));

                expect(camera.position).toEqual(new Point(0, 0));

                camera.move(1, 0);

                expect(camera.position).toEqual(new Point(1, -1));

                camera.move(0, 1);

                expect(camera.position).toEqual(new Point(3, 1));

                camera.move(0, 1);

                expect(camera.position).toEqual(new Point(5, 3));

                camera.move(1, 0);

                expect(camera.position).toEqual(new Point(6, 2));

                camera.move(-2, -2);

                expect(camera.position).toEqual(new Point(0, 0));
                done();
            });
        });
    });
});
