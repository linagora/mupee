'use strict';

angular.module('mupeeProduct', ['mupeeRouteSegment', 'mupeeVersion'])
  .controller('productHome', ['mupeeProduct', 'versionAPI', '$scope',
      function(mupeeProduct, versionAPI, $scope) {
        $scope.product = mupeeProduct.getCurrent();
        $scope.loadProgress = true;
        $scope.networkError = false;
        $scope.versions = [];

        versionAPI.getProductVersions($scope.product, function(err, versions) {
          $scope.loadProgress = false;
          if (err) {
            $scope.networkError = true;
            return $scope.networkError;
          }
          angular.forEach(versions, function(sourceVersion) {
            var major = sourceVersion.version.split('.').shift();
            var versionDetails = {
              majorVersion: major,
              locale: sourceVersion.locale,
              channel: sourceVersion.channel,
              os: sourceVersion.osVersion,
              updates: sourceVersion.updates
            };
            if ($scope.versions.indexOf(versionDetails) < 0) {
              $scope.versions.push(versionDetails);
            }
          });
          $scope.versions.sort(function(a, b) {return a.majorVersion > b.majorVersion; });

          $scope.directive = {opened: null};
          $scope.toggle = function(key) {
            if (key === $scope.directive.opened) {
              $scope.directive.opened = null;
            } else {
              $scope.directive.opened = key;
            }
          };
        });
      }])
  .factory('mupeeProduct', ['mupeeRouteSegment', function(mupeeRouteSegment) {
      function getCurrent() {
        var product;
        try {
          product = mupeeRouteSegment.getLocationSegments().shift();
        } catch (e) {}
        return product;
      }

      return {
        getCurrent: getCurrent
      };
    }]);
