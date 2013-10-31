'use strict';

(function() {

  angular
    .module('mupeeExtensionsList', ['mupeeAPI', 'mupeeFilters'])
    .directive('extensionsList', ['API', function(API) {
      function controller($scope) {
        $scope.modes = {
            LOAD: 'load',
            DISPLAY: 'display'
          };
        $scope.mode = $scope.modes.LOAD;

        API.extensions.list($scope.product, $scope.version).then(function(results) {
          $scope.extensions = results;
          $scope.mode = $scope.modes.DISPLAY;
        });
      }

      return {
        restrict: 'A',
        replace: true,
        scope: {
          'product': '@',
          'version': '@'
        },
        templateUrl: 'directives/extensionsList',
        controller: ['$scope', controller]
      };
    }]);

})();
