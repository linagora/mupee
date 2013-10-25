'use strict';

var expect = require('chai').expect;

var Loader = require('../../../backend/rules/loader');

describe('The Predicate', function() {
  describe('product equals', function() {
    var matchesFirefox = Loader.predicates.productEquals.for({ product: 'Firefox' });

    it('does not match if candidate product is different from parameter', function() {
      var result = matchesFirefox({ product: 'Stupid Product' });
      expect(result).to.be.a('boolean');
      expect(result).to.be.false;
    });

    it('matches if the candidate product is the same as the parameter ', function() {
      var result = matchesFirefox({ product: 'Firefox' });
      expect(result).to.be.a('boolean');
      expect(result).to.be.true;
    });
  });
});

