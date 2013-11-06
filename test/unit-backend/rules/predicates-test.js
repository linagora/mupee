'use strict';

var expect = require('chai').expect,
    mockery = require('mockery'),
    testLogger = require('../test-logger');

var Loader;

describe('The Predicate', function() {

  var CandidateTypes;

  before(function() {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    mockery.registerMock('../../logger', testLogger);
    Loader = require('../../../backend/rules/loader');
    CandidateTypes = require('../../../backend/rules/candidate-types');
  });

  describe('productEquals', function() {

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

    describe('allowedCandidate property', function() {
      it('should be SourceVersion', function() {
        expect(Loader.predicates.productEquals.allowedCandidate).to.equals(CandidateTypes.SourceVersion);
      });
    });

  });

  describe('branchEquals', function() {

    describe('allowedCandidate property', function() {
      it('should be SourceVersion', function() {
        expect(Loader.predicates.branchEquals.allowedCandidate).to.equals(CandidateTypes.SourceVersion);
      });
    });

  });

  describe('extBranchEquals', function() {

    describe('allowedCandidate property', function() {
      it('should be ExtensionSourceVersion', function() {
        expect(Loader.predicates.extBranchEquals.allowedCandidate).to.equals(CandidateTypes.ExtensionSourceVersion);
      });
    });

  });

  describe('extIdEquals', function() {

    describe('allowedCandidate property', function() {
      it('should be ExtensionSourceVersion', function() {
        expect(Loader.predicates.extIdEquals.allowedCandidate).to.equals(CandidateTypes.ExtensionSourceVersion);
      });
    });

  });

  describe('extProductEquals', function() {

    describe('allowedCandidate property', function() {
      it('should be ExtensionSourceVersion', function() {
        expect(Loader.predicates.extProductEquals.allowedCandidate).to.equals(CandidateTypes.ExtensionSourceVersion);
      });
    });

  });

  after(function() {
    mockery.deregisterAll();
    mockery.disable();
    mockery.resetCache();
  });
});

