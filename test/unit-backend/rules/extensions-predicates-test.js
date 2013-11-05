'use strict';

var expect = require('chai').expect,
    mockery = require('mockery'),
    testLogger = require('../test-logger');

var Loader, productMapper;

describe('The Predicate', function() {

  before(function() {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    mockery.registerMock('../../logger', testLogger);
    Loader = require('../../../backend/rules/loader');
    productMapper = require('../../../backend/product-mapper');
  });

  describe('extProductEquals', function() {

    it('does not match if candidate product is different from parameter', function() {
      var matchesThunderbird = Loader.predicates.extProductEquals.for({ product: 'Thunderbird' });
      var result = matchesThunderbird({ appId: productMapper.idFromName('Firefox') });
      expect(result).to.be.a('boolean');
      expect(result).to.be.false;
    });

    it('matches if the candidate product is the same as the parameter ', function() {
      var matchesFirefox = Loader.predicates.extProductEquals.for({ product: 'Firefox' });
      var result = matchesFirefox({ appId: productMapper.idFromName('Firefox') });
      expect(result).to.be.a('boolean');
      expect(result).to.be.true;
    });
    
    it('does not match if the parameter product is unknown', function() {
      var matchesFirefox = Loader.predicates.extProductEquals.for({ product: 'Unknown' });
      var result = matchesFirefox({ appId: productMapper.idFromName('Firefox') });
      expect(result).to.be.a('boolean');
      expect(result).to.be.false;
    });
  });
  
  describe('extIdEquals', function() {
    var someID = '{c6dbb670-c4ce-4222-a910-a9865da9721c}';
    it('does not match if candidate id is different from parameter', function() {
      var matchesExtId = Loader.predicates.extIdEquals.for({ id: someID });
      var result = matchesExtId({ id: 'foo' });
      expect(result).to.be.a('boolean');
      expect(result).to.be.false;
    });

    it('matches if the candidate id is the same as the parameter ', function() {
      var matchesExtId = Loader.predicates.extIdEquals.for({ id: someID });
      var result = matchesExtId({ id: someID });
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

