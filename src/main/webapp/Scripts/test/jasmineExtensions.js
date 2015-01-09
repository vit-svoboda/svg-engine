define(['point'], function(Point){

    var matchers = getJasmineRequireObj();

    beforeEach(function () {

        jasmine.addCustomEqualityTester(function (first, second) {
            if (first instanceof Point && second instanceof Point) {
                return matchers.toBeCloseTo(first.x, second.x, 5)
                    && matchers.toBeCloseTo(first.y, second.y, 5);
            }
        });
    });
});


