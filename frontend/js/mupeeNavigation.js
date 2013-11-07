'use strict';

function setBackgroundToBody(path) {
  $(document.body).removeClass();
  if (path === 'Thunderbird' || path === 'Firefox') {
    $(document.body).addClass(path);
  }
}

angular.module('mupeeNavigation', [])
.controller('isHomepage', ['$scope', '$location', function($scope, $location) {
  $scope.$on('$routeChangeSuccess', function() {
    $scope.homepage = $location.path() === '/home';
    setBackgroundToBody($location.path().substr(1));
  });
}]);
