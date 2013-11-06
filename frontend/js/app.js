'use strict';

angular.module('myApp', ['ngRoute', 'mupeeProduct', 'mupeeUploader', 'mupeeNavigation', 'mupeeAutoComplete'])
  .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/home', {templateUrl: 'partials/home'});
      $routeProvider.when('/Firefox', {templateUrl: 'partials/productHome', controller: 'productHome'});
      $routeProvider.when('/Thunderbird', {templateUrl: 'partials/productHome', controller: 'productHome'});
      $routeProvider.when('/uploadExtension', {templateUrl: 'partials/uploadExtension'});
      $routeProvider.otherwise({redirectTo: '/home'});
    }])
  .run(function($rootScope) {
      $rootScope.$on('$viewContentLoaded', function() {
        $(document).foundation();
      });
    });
