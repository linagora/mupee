'use strict';

var Predicate = require('../predicate.js');

var productEquals = new Predicate({
  id : 'productEquals',
  summary : 'product equals',
  description : 'true if product matches with candidate',
  predicate : function(candidate, parameters) {
    if (candidate.product == parameters.product) {
      return true;
    } else {
      return false;
    }
  },
  parametersDefinitions : [{
    id : 'product',
    summary : 'product name',
    description : 'a Mozilla product name',
    type : 'string',
    mandatory : true
  }]
});

module.exports = productEquals;
