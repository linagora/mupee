'use strict';

var expect = require('chai').expect,
    mockery = require('mockery'),
    testLogger = require('../test-logger');

var fixtures,
    fixturesForExtensions,
    SourceVersion,
    Loader;

describe('The Action', function() {

  before(function() {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    mockery.registerMock('../../logger', testLogger);
    fixtures = require('../source-version-fixtures.js');
    fixturesForExtensions = require('../extension-source-version-fixtures.js');
    SourceVersion = require('../../../backend/source-version');
    Loader = require('../../../backend/rules/loader');
  });

  describe('deny', function() {
    it('always return an empty update list', function() {
      var deny = Loader.actions.deny.for({});
      var candidate = new SourceVersion(fixtures.thunderbird3);
      var result = deny(candidate);
      expect(result.updates).to.have.length(0);
    });
  });

  describe('allow', function() {
    it('always return an unmodified update list', function() {
      var allow = Loader.actions.allow.for({});
      var candidate = new SourceVersion(fixtures.thunderbird3);
      var updateNbr = candidate.updates.length;
      var result = allow(candidate);
      expect(result.updates.length).to.equal(updateNbr);
    });
  });

  describe('latestForBranch', function() {
    it('should only return updates for the latest release of the given version branch', function() {
      var latestForBranch = Loader.actions.latestForBranch.for({branch: 12});
      var candidate = new SourceVersion(fixtures.thunderbird3);
      var result = latestForBranch(candidate);
      expect(result.updates).to.have.length(1);
      expect(result.updates[0].version).to.equal('12.0.2');
    });
  });

  describe('latestForCurrentBranch', function() {
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
  });

  after(function() {
    mockery.deregisterAll();
    mockery.disable();
    mockery.resetCache();
  });

});
