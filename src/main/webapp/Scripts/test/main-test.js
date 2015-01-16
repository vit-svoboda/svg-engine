(function () {

    var tests = ['test/jasmineExtensions', 'test/unit/camera.spec', 'test/unit/datacache.spec', 'test/integration/engine.spec'];

    require.config({
        baseUrl: window.__karma__ ? '/base' : '../Scripts',
        paths: {
            QUnit: 'http://code.jquery.com/qunit/qunit-1.15.0',
            jquery: 'third-party/jquery',
            svg: 'third-party/svg',
            boot: 'third-party/jasmine-2.1.0/boot',
            jasmine: 'third-party/jasmine-2.1.0/jasmine',
            'jasmine-html': 'third-party/jasmine-2.1.0/jasmine-html'
        },
        shim: {
            jasmine: {
                exports: 'window.jasmineRequire'
            },
            'jasmine-html': {
                deps: ['jasmine'],
                exports: 'window.jasmineRequire'
            },
            boot: {
                deps: ['jasmine', 'jasmine-html'],
                exports: 'window.jasmineRequire'
            }
        }
    });

    if (window.__karma__) {
        require(tests, window.__karma__.start);
    } else {
        require(['boot'], function () {
            require(tests, function () {
                window.onload();
            });
        });
    }
})();
