'use strict';

var expect = require('chai').expect,
    mockery = require('mockery'),
    testLogger = require('../test-logger');

var fixtures,
    fixturesForExtensions,
    SourceVersion,
    Loader;

describe('The Action', function() {

  var CandidateTypes;

  before(function() {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    mockery.registerMock('../../logger', testLogger);
    fixtures = require('../source-version-fixtures.js');
    fixturesForExtensions = require('../extension-source-version-fixtures.js');
    SourceVersion = require('../../../backend/source-version');
    Loader = require('../../../backend/rules/loader');
    CandidateTypes = require('../../../backend/rules/candidate-types');
  });

  describe('deny', function() {
    describe('isCompatibleWithPredicates', function() {
      it('should be a function', function() {
        var deny = Loader.actions.deny;
        expect(deny.isCompatibleWithPredicates).to.be.a.function;
      });
      it('should be compatible whatever predicates are given', function() {
        var deny = Loader.actions.deny;
        var predicates = [
          {id: 'foo'},
          {id: 'extIdEquals'},
          {id: 'bar'}
        ];
        var compatible = deny.isCompatibleWithPredicates(predicates);
        expect(compatible).to.be.true;

        compatible = deny.isCompatibleWithPredicates([]);
        expect(compatible).to.be.true;
      });
    });

    describe('allowed candidates', function() {
      it('should be an array', function() {
        var deny = Loader.actions.deny;
        expect(deny.allowedCandidates).to.be.an.array;
      });
      it('should only contain SourceVersion and ExtensionSourceVersion', function() {
        var deny = Loader.actions.deny;
        expect(deny.allowedCandidates).to.have.length(2);
        expect(deny.allowedCandidates).to.contain(CandidateTypes.SourceVersion);
        expect(deny.allowedCandidates).to.contain(CandidateTypes.ExtensionSourceVersion);
      });
    });

    it('always return an empty update list with SourceVersion', function() {
      var deny = Loader.actions.deny.for({});
      var candidate = new SourceVersion(fixtures.thunderbird3);
      var result = deny(candidate);
      expect(result.updates).to.have.length(0);
    });

    it('always return an empty update list with ExtensionSourceVersion', function() {
      var deny = Loader.actions.deny.for({});
      var candidate = fixturesForExtensions.ltn123TB17WithLotOfUpdates();
      var result = deny(candidate);
      expect(result.updates).to.have.length(0);
    });
  });

  describe('allow', function() {

    describe('isCompatibleWithPredicates', function() {
      it('should be a function', function() {
        var allow = Loader.actions.allow;
        expect(allow.isCompatibleWithPredicates).to.be.a.function;
      });
      it('should be compatible whatever predicates are given', function() {
        var allow = Loader.actions.allow;
        var predicates = [
          {id: 'foo'},
          {id: 'extIdEquals'},
          {id: 'bar'}
        ];
        var compatible = allow.isCompatibleWithPredicates(predicates);
        expect(compatible).to.be.true;

        compatible = allow.isCompatibleWithPredicates([]);
        expect(compatible).to.be.true;
      });
    });

    describe('allowed candidates', function() {
      it('should be an array', function() {
        var allow = Loader.actions.allow;
        expect(allow.allowedCandidates).to.be.an.array;
      });

      it('should only contain SourceVersion and ExtensionSourceVersion', function() {
        var allow = Loader.actions.allow;
        expect(allow.allowedCandidates).to.have.length(2);
        expect(allow.allowedCandidates).to.contain(CandidateTypes.SourceVersion);
        expect(allow.allowedCandidates).to.contain(CandidateTypes.ExtensionSourceVersion);
      });
    });


    it('always return an unmodified update list with SourceVersion', function() {
      var allow = Loader.actions.allow.for({});
      var candidate = new SourceVersion(fixtures.thunderbird3);
      var updateNbr = candidate.updates.length;
      var result = allow(candidate);
      expect(result.updates.length).to.equal(updateNbr);
    });

    it('always return an unmodified update list with ExtensionSourceVersion', function() {
      var allow = Loader.actions.allow.for({});
      var candidate = fixturesForExtensions.ltn123TB17WithLotOfUpdates();
      var updateNbr = candidate.updates.length;
      var result = allow(candidate);
      expect(result.updates.length).to.equal(updateNbr);
    });
  });

  describe('latestForBranch', function() {

    describe('isCompatibleWithPredicates', function() {
      it('should be a function', function() {
        var latestForBranch = Loader.actions.latestForBranch;
        expect(latestForBranch.isCompatibleWithPredicates).to.be.a.function;
      });
      it('should be compatible if the productEquals predicate is given', function() {
        var latestForBranch = Loader.actions.latestForBranch;
        var predicates = [
          {id: 'foo'},
          {id: 'productEquals'},
          {id: 'bar'}
        ];
        var compatible = latestForBranch.isCompatibleWithPredicates(predicates);
        expect(compatible).to.be.true;
      });
      it('should not be compatible if the productEquals predicate is not given', function() {
        var latestForBranch = Loader.actions.latestForBranch;
        var predicates = [
          {id: 'foo'},
          {id: 'colorEquals'},
          {id: 'bar'}
        ];
        var compatible = latestForBranch.isCompatibleWithPredicates(predicates);
        expect(compatible).to.be.false;
      });
    });

    describe('allowed candidates', function() {
      it('should be an array', function() {
        var latestForBranch = Loader.actions.latestForBranch;
        expect(latestForBranch.allowedCandidates).to.be.an.array;
      });

      it('should only contain SourceVersion', function() {
        var latestForBranch = Loader.actions.latestForBranch;
        expect(latestForBranch.allowedCandidates).to.have.length(1);
        expect(latestForBranch.allowedCandidates).to.contain(CandidateTypes.SourceVersion);
      });
    });

    it('should only return updates for the latest release of the given version branch', function() {
      var latestForBranch = Loader.actions.latestForBranch.for({branch: 12});
      var candidate = new SourceVersion(fixtures.thunderbird3);
      var result = latestForBranch(candidate);
      expect(result.updates).to.have.length(1);
      expect(result.updates[0].version).to.equal('12.0.2');
    });
  });

  describe('latestForCurrentBranch', function() {

    describe('isCompatibleWithPredicates', function() {
      it('should be a function', function() {
        var latestForCurrentBranch = Loader.actions.latestForCurrentBranch;
        expect(latestForCurrentBranch.isCompatibleWithPredicates).to.be.a.function;
      });
      it('should be compatible if the productEquals predicate is given', function() {
        var latestForCurrentBranch = Loader.actions.latestForCurrentBranch;
        var predicates = [
          {id: 'foo'},
          {id: 'productEquals'},
          {id: 'bar'}
        ];
        var compatible = latestForCurrentBranch.isCompatibleWithPredicates(predicates);
        expect(compatible).to.be.true;
      });
      it('should not be compatible if the productEquals predicate is not given', function() {
        var latestForCurrentBranch = Loader.actions.latestForCurrentBranch;
        var predicates = [
          {id: 'foo'},
          {id: 'colorEquals'},
          {id: 'bar'}
        ];
        var compatible = latestForCurrentBranch.isCompatibleWithPredicates(predicates);
        expect(compatible).to.be.false;
      });
    });

    describe('allowed candidates', function() {
      it('should be an array', function() {
        var latestForCurrentBranch = Loader.actions.latestForCurrentBranch;
        expect(latestForCurrentBranch.allowedCandidates).to.be.an.array;
      });

      it('should only contain SourceVersion', function() {
        var latestForCurrentBranch = Loader.actions.latestForCurrentBranch;
        expect(latestForCurrentBranch.allowedCandidates).to.have.length(1);
        expect(latestForCurrentBranch.allowedCandidates).to.contain(CandidateTypes.SourceVersion);
      });
    });

    it('should only return updates for the latest release of the current version branch', function() {
      var latestForCurrentBranch = Loader.actions.latestForCurrentBranch.for();
      var candidate = new SourceVersion(fixtures.thunderbird3);
      var result = latestForCurrentBranch(candidate);
      expect(result.updates).to.have.length(1);
      expect(result.updates[0].appVersion).to.equal('3.3.0');
    });
  });

  describe('upgradeToVersion', function() {
    it('should only return the specific update for given version with a ExtensionSourceVersion', function() {
      var upgradeToVersion = Loader.actions.upgradeToVersion.for({version: '2.9a.1'});
      var candidate = fixturesForExtensions.ltn123TB17WithLotOfUpdates();
      var result = upgradeToVersion(candidate);
      expect(result.updates).to.have.length(1);
      expect(result.updates[0].version).to.equal('2.9a.1');
      expect(result.updates[0].targetApplication.id).to.equal('{3550f703-e582-4d05-9a08-453d09bdfdc9}');
    });

    it('should return nothing if there is no update for given version with a ExtensionSourceVersion', function() {
      var upgradeToVersion = Loader.actions.upgradeToVersion.for({version: '12.abcd.abcd'});
      var candidate = fixturesForExtensions.ltn123TB17WithLotOfUpdates();
      var result = upgradeToVersion(candidate);
      expect(result.updates).to.be.empty;
    });

    describe('isCompatibleWithPredicates', function() {
      it('should be a function', function() {
        var upgradeToVersion = Loader.actions.upgradeToVersion;
        expect(upgradeToVersion.isCompatibleWithPredicates).to.be.a.function;
      });
      it('should be compatible if one of the predicate is extIdEquals', function() {
        var upgradeToVersion = Loader.actions.upgradeToVersion;
        var predicates = [
          {id: 'foo'},
          {id: 'extIdEquals'},
          {id: 'bar'}
        ];
        var compatible = upgradeToVersion.isCompatibleWithPredicates(predicates);
        expect(compatible).to.be.true;
      });
      it('should not be compatible if no predicate is extIdEquals', function() {
        var upgradeToVersion = Loader.actions.upgradeToVersion;
        var predicates = [
          {id: 'foo'},
          {id: 'extColorEquals'},
          {id: 'bar'}
        ];
        var compatible = upgradeToVersion.isCompatibleWithPredicates(predicates);
        expect(compatible).to.be.false;
      });
    });

    describe('allowed candidates', function() {
      it('should be an array', function() {
        var upgradeToVersion = Loader.actions.upgradeToVersion;
        expect(upgradeToVersion.allowedCandidates).to.be.an.array;
      });

      it('should only contain ExtensionSourceVersion', function() {
        var upgradeToVersion = Loader.actions.upgradeToVersion;
        expect(upgradeToVersion.allowedCandidates).to.have.length(1);
        expect(upgradeToVersion.allowedCandidates).to.contain(CandidateTypes.ExtensionSourceVersion);
      });
    });

  });

  after(function() {
    mockery.deregisterAll();
    mockery.disable();
    mockery.resetCache();
  });

});
