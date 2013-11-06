'use strict';

angular.module('mupeeAutoComplete', [])
  .directive('autoComplete', function() {
      function controller($scope, $http) {
        var uuid = require('node-uuid');
        $scope.datalistUuid = uuid.v1();

        $http.get('/autocomplete/datalist', {
          params: {
            id: $scope.id,
            property: $scope.property,
            targetMode: $scope.targetMode,
            //version: $scope.branchDetail.members[$scope.$index],
            version: $scope.version,
            product: $scope.product
          }
        })
          .then(
            function(response) {
              $scope.mongoValues = response.data || [];
            });
      }

      function link(scope, element, attrs) {
        element.attr('list', scope.datalistUuid.toString());
        scope.$watch(attrs.ngModel, function(value) {
          console.log(value);
        });
      }

      return {
        retrict: 'A',
        scope: {
          id: '@',
          property: '@',
          targetMode: '@',
          version: '@',
          product: '@'
        },
        controller: controller,
        link: link,
        templateUrl: 'directives/autoComplete'
      };
    });
