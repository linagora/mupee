'use strict';

angular.module('mupeeAutoComplete', [])
  .directive('autoComplete', function($http) {

      var uniqueIdCounter = 1;

      function controller($scope) {
        $scope.datalistUuid = 'autoCompleteID' + uniqueIdCounter++;
      }

      function link(scope, element, attrs) {
        element.attr('list', scope.datalistUuid.toString());
        scope.$watch(attrs.ngModel, function(value) {
          $http.get('/autocomplete/datalist', {
            params: {
              id: scope.id,
              property: scope.property,
              targetMode: scope.targetMode,
              //version: $scope.branchDetail.members[$scope.$index],
              value: value,
              version: scope.version,
              product: scope.product
            }
          })
            .then(
              function(response) {
                scope.mongoValues = response.data || [];
              });
        });
      }

      return {
        retrict: 'A',
        scope: {
          id: '@',
          property: '@',
          targetMode: '@',
          version: '@',
          product: '@',
          parameter: '=parameter'
        },
        controller: controller,
        link: link,
        templateUrl: 'directives/autoComplete'
      };
    });
