// Karma configuration
module.exports = function(config) {
  config.set({
      
    basePath: '../',  
      
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
      'test/main-test.js',
      { pattern: '*.js', included: false },
      { pattern: 'third-party/*.js', included: false },
      { pattern: 'test/jasmineExtensions.js', included: false },
      { pattern: 'test/unit/*.spec.js', included: false },
      { pattern: 'test/integration/*.spec.js', included: false }
    ],
    
    exclude: [
        'third-party/require.js',
        'main.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
