'use strict';

angular
  .module('mupeeFilters', [])
  .filter('joinWithDefault', function() {
    return function arrayToString(input, def) {
      return input && input.length ? input.join(', ') : def;
    };
  });
