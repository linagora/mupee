'use strict';

var expect = require('chai').expect,
    mockery = require('mockery'),
    testLogger = require('../test-logger');

var Loader;

describe('The Predicate', function() {

  before(function() {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    mockery.registerMock('../../logger', testLogger);
    Loader = require('../../../backend/rules/loader');
  });

  describe('product equals', function() {

    it('does not match if candidate product is different from parameter', function() {
      var matchesFirefox = Loader.predicates.productEquals.for({ product: 'Firefox' });
      var result = matchesFirefox({ product: 'Stupid Product' });
      expect(result).to.be.a('boolean');
      expect(result).to.be.false;
    });

    it('matches if the candidate product is the same as the parameter ', function() {
      var matchesFirefox = Loader.predicates.productEquals.for({ product: 'Firefox' });
      var result = matchesFirefox({ product: 'Firefox' });
      expect(result).to.be.a('boolean');
      expect(result).to.be.true;
    });
  });

  after(function() {
    mockery.deregisterAll();
    mockery.disable();
    mockery.resetCache();
  });
});

