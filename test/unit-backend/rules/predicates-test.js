'use strict';

var expect = require('chai').expect;
require('chai').should();

var Loader = require('../../../backend/rules/rules-loader');

describe('The rule predicate', function() {
  describe('product equal to firefox', function() {
    var matchesFirefox = Loader.predicates.productEquals.for({ product : "Firefox"});

    it('does not match if product is not Firefox', function() {
      var result = matchesFirefox({ product : "Thunderbird"});
      expect(result).to.be.a('boolean');
      expect(result).to.be.false;
    });

    it('matches if product is Firefox', function() {
      var result = matchesFirefox({ product : "Firefox"});
      expect(result).to.be.a('boolean');
      expect(result).to.be.true;
    });
  });
});

