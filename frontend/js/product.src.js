'use strict';

angular.module('mupeeProduct', ['mupeeRouteSegment', 'mupeeVersion', 'mupeeUpgradeAction', 'mupeeExtensionsList'])
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

        var mvc = require('mozilla-version-comparator');
        versions.sort(function(a, b) {
          return mvc(a.version, b.version);
        });

        var versionBranches = {};

        angular.forEach(versions, function(sourceVersion) {
          var date = new Date(sourceVersion.timestamp).toLocaleString();
          var formatedOs = sourceVersion.osVersion.replace('_', ' ');
          var versionDetails = {
            version: sourceVersion.version,
            timestamp: date,
            locale: sourceVersion.locale,
            channel: sourceVersion.channel,
            os: formatedOs
          };
          if (!versionBranches[sourceVersion.branch]) {
            versionBranches[sourceVersion.branch] = {
              branch: parseInt(sourceVersion.branch, 10),
              members: []
            };
            $scope.versions.push(versionBranches[sourceVersion.branch]);
          }
          versionBranches[sourceVersion.branch].members.push(versionDetails);
        });
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
