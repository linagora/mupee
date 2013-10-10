"use strict";

angular.module("mupeeRouteSegment", [])
.factory("mupeeRouteSegment", ["$location",function($location) {
  return {
    getLocationSegments: function() {
      var path = $location.path().replace(/^\/+/,'');
      return path.length ? this.explode(path) : [];
    },
    explode: function(path) {
      return path.split('/');
    },
    implode: function(segments) {
      var encodedSegments = [];
      segments.forEach(function(value) {
        encodedSegments.push(encodeURIComponent(value));
      });
      return encodedSegments.join('/');
    }
  };
}]);