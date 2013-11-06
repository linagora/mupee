'use strict';

module.exports = function(config) {
  config.set({
    basePath: '../../',

    files: [
      'frontend/lib/jquery/jquery.js',
      'frontend/lib/angular/angular.js',
      'frontend/lib/angular/angular-*.js',
      'test/lib/angular/angular-mocks-mocha.js',
      'test/lib/chai.js',
      'frontend/js/**/*.js',
      'test/unit-frontend/**/*.js',
      'frontend/views/directives/*.jade'
    ],
    exclude: [
      'frontend/js/product.src.js',
      'frontend/js/directives/autoComplete.src.js'
    ],

    frameworks: ['mocha'],
    colors: true,
    singleRun: true,
    autoWatch: true,
    browsers: ['PhantomJS', 'SlimerJS', 'Chrome', 'Firefox'],
    reporters: ['coverage', 'spec'],
    preprocessors: {
      'frontend/js/*.js': ['coverage'],
      '**/*.jade': 'ng-html2js'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'frontend/views/',
      stripSuffix: '.jade',
      jade: true
    },

    plugins: [
      'karma-junit-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-coverage',
      'karma-spec-reporter',
      'karma-slimerjs-launcher',
      'karma-ng-html2js-preprocessor'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit-frontend'
    },
    coverageReporter: {type: 'text', dir: '/tmp'}
  });
};
