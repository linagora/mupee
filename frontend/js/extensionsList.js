'use strict';

angular
  .module('mupeeExtensionsList', ['mupeeAPI', 'mupeeFilters'])
  .directive('extensionsList', ['API', function(API) {
    function controller($scope) {
      $scope.modes = {
          LOAD: 'load',
          DISPLAY: 'display',
          ERROR: 'error'
        };
      $scope.mode = $scope.modes.LOAD;

      API.extensions.list($scope.product, $scope.version).then(function(results) {
        $scope.extensionsById = {};
        $scope.extensions = [];

        results.forEach(function(result) {
          if (!$scope.extensionsById[result.id]) {
            $scope.extensionsById[result.id] = result.name;
            $scope.extensions.push({
              id: result.id,
              name: result.name
            });
          }
        });

        $scope.mode = $scope.modes.DISPLAY;
      }, function(error) {
        $scope.error = error;
        $scope.mode = $scope.modes.ERROR;
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
