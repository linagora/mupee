"use strict";

angular.module("mupeeVersion", [])
.factory("versionAPI", ["$http",function($http) {
  
  function getProductVersions (product, callback) {
    $http.get("/admin/versions",{
      params: {
        product: product
      }
    }).success(function(data, status, headers, config) {
      callback(null,data,status,headers,config);
    }).error(function(data, status, headers, config) {
      callback(status,data,status,headers,config);
    });
    ;
  };
  
  return {
    getProductVersions: getProductVersions
  };
  
}]);