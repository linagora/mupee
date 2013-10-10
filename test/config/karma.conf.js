module.exports = function(config){
    config.set({
      basePath: '../../',

      files: [
        'frontend/lib/angular/angular.js',
        'frontend/lib/angular/angular-*.js',
        'test/lib/angular/angular-mocks-mocha.js',
        'test/lib/chai.js',
        'frontend/js/*.js',
        'test/unit-frontend/**/*.js'
      ],

      frameworks: ['mocha'],
      colors: true,
      singleRun: true,
      autoWatch: true,
      browsers: ['PhantomJS'],

      reporters: ['progress'],
      plugins: [
              'karma-junit-reporter',
              'karma-chrome-launcher',
              'karma-firefox-launcher',
              'karma-jasmine',
              'karma-phantomjs-launcher',
              'karma-mocha'
              ],

      junitReporter: {
        outputFile: 'test_out/unit.xml',
        suite: 'unit-frontend'
      }
    });
};
