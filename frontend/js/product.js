"use strict";

angular.module("mupeeProduct", ["mupeeRouteSegment", "mupeeVersion"])
.controller("productHome", ["mupeeProduct","versionAPI", "$scope",
  function(mupeeProduct,versionAPI, $scope) {
    $scope.product = mupeeProduct.getCurrent();
    $scope.loadProgress = true;
    $scope.networkError = false;
    $scope.majorVersions = [];
    versionAPI.getProductVersions($scope.product,function(err,versions) {
      $scope.loadProgress = false;
      if ( err ) {
        return $scope.networkError = true;
      }
      angular.forEach(versions, function(sourceVersion) {
        var major = sourceVersion.version.split('.').shift();
        if ( $scope.majorVersions.indexOf(major) < 0 ) {
          $scope.majorVersions.push(major);
        }
      });
      $scope.majorVersions.sort();
    });
  }
])
.factory("mupeeProduct",['mupeeRouteSegment',function(mupeeRouteSegment) {
  function getCurrent() {
    var product;
    try {
      product = mupeeRouteSegment.getLocationSegments().shift();
    } catch(e) {
    }
    return product;
  };
  
  return {
    getCurrent: getCurrent
  };
}]);