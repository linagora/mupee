'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['ngRoute']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);
