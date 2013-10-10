'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['ngRoute', 'mupeeProduct']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home'});
    $routeProvider.when('/Firefox', {templateUrl: 'partials/productHome', controller: 'productHome'});
    $routeProvider.when('/Thunderbird', {templateUrl: 'partials/productHome', controller: 'productHome'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);
