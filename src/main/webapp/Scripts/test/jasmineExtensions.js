define(['point'], function(Point){

    // Extract the default float matcher from jasmine
    var matcher = getJasmineRequireObj().toBeCloseTo()();

    beforeEach(function () {

        jasmine.addCustomEqualityTester(function (first, second) {
            if (first instanceof Point && second instanceof Point) {
                return matcher.compare(first.x, second.x, 5).pass
                    && matcher.compare(first.y, second.y, 5).pass;
            }
        });
    });
});


