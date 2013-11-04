'use strict';

/* global chai: false */

var expect = chai.expect;
describe('The navigation controller', function() {
  var $rs;
  var $ctrl;

  beforeEach(module('mupeeNavigation'));
  beforeEach(inject(function($rootScope, $controller) {
    $rs = $rootScope;
    $ctrl = $controller;
  }));

  it('should set homepage=true if we\'re on the home page', function() {
    var $scope = $rs.$new();

    $scope.$on = function(name, callback) {
      callback();
    };
    $ctrl('isHomepage', {
      $scope: $scope,
      $location: {
        path: function() {
          return '/home';
        }
      }
    });

    expect($scope.homepage).to.be.true;
  });

  it('should set homepage=false if we\'re on Firefox product page', function() {
    var $scope = $rs.$new();

    $scope.$on = function(name, callback) {
      callback();
    };
    $ctrl('isHomepage', {
      $scope: $scope,
      $location: {
        path: function() {
          return '/#/Firefox';
        }
      }
    });

    expect($scope.homepage).to.be.false;
  });

});
