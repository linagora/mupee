'use strict';

var expect = require('chai').expect;

var fixtures = require('../source-version-fixtures.js'),
    SourceVersion = require('../../../backend/source-version'),
    Loader = require('../../../backend/rules/loader');


describe('The Action', function() {
  describe('deny', function() {
    var deny = Loader.actions.deny.for({});

    it('always return an empty update list', function() {
      var candidate = new SourceVersion(fixtures.thunderbird3);
      var result = deny(candidate);
      expect(result.updates).to.have.length(0);
    });
  });

  describe('allow', function() {
    var allow = Loader.actions.allow.for({});

    it('always return an unmodified update list', function() {
      var candidate = new SourceVersion(fixtures.thunderbird3);
      var updateNbr = candidate.updates.length;
      var result = allow(candidate);
      expect(result.updates.length).to.equal(updateNbr);
    });
  });

  describe('latestForBranch', function() {
    var latestForBranch = Loader.actions.latestForBranch.for({branch: 12});
    it('should only return updates for the latest release of the given version branch', function() {
      var candidate = new SourceVersion(fixtures.thunderbird3);
      var result = latestForBranch(candidate);
      expect(result.updates).to.have.length(1);
      expect(result.updates[0].version).to.equal('12.0.2');
    });
  });

  describe('latestForCurrentBranch', function() {
    var latestForCurrentBranch = Loader.actions.latestForCurrentBranch.for();
    it('should only return updates for the latest release of the current version branch', function() {
      var candidate = new SourceVersion(fixtures.thunderbird3);
      var result = latestForCurrentBranch(candidate);
      expect(result.updates).to.have.length(1);
      expect(result.updates[0].appVersion).to.equal('3.3.0');
    });
  });
});
