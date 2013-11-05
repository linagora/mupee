'use strict';

var expect = require('chai').expect,
    mockery = require('mockery'),
    testLogger = require('../test-logger');

var fixtures,
    SourceVersion,
    Loader;


describe('The Action', function() {

  before(function() {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    mockery.registerMock('../../logger', testLogger);
    fixtures = require('../source-version-fixtures.js');
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

  after(function() {
    mockery.deregisterAll();
    mockery.disable();
    mockery.resetCache();
  });
});
