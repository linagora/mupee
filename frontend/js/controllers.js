'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function($scope, $http) {

    $http({
      method: 'GET',
      url: '/admin/updates'
    }).
    success(function(data, status, headers, config) {
      $scope.versions = data;
    }).
    error(function(data, status, headers, config) {
      $scope.name = 'Error!';
    });

  }).
  controller('MyCtrl1', function($scope) {

  }).
  controller('MyCtrl2', function($scope) {

  });

