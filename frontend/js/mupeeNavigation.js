'use strict';

angular.module('mupeeNavigation', [])
.controller('isHomepage', ['$scope', '$location', function($scope, $location) {
  $scope.$on('$routeChangeSuccess', function() {
    $scope.homepage = $location.path() === '/home';
  });
}]);
