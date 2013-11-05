'use strict';

var expect = require('chai').expect,
    mockery = require('mockery'),
    testLogger = require('../test-logger');
require('chai').should();

var defaultRules,
    fixtures;

describe('The Default Rule', function() {
  before(function() {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    mockery.registerMock('../../logger', testLogger);
    defaultRules = require('../../../backend/rules/default-rules'),
    fixtures = require('../source-version-fixtures.js');
  });

  describe('deny all for Firefox', function() {

    it('should apply when candidate product is Firefox, and return an empty set of possible updates', function() {
      var rule = defaultRules.denyAllUpgradesForFirefox;
      var candidate = fixtures.firefox3;
      var apply = rule.action.apply;
      apply.should.be.a.function;

      expect(rule.matches(candidate)).to.be.true;
    });

    it('and prepare an empty update list to send back to the client', function() {
      var rule = defaultRules.denyAllUpgradesForFirefox;
      var candidate = fixtures.firefox3;
      var apply = rule.action.apply;

      var result = apply(candidate);
      expect(result).not.to.be.null;
      expect(result.updates).to.be.an.array;
      expect(result.updates).to.have.length(0);
    });

    it('should not apply when candidate product is not Firefox', function() {
      var rule = defaultRules.denyAllUpgradesForFirefox;

      var wrongCandidate = fixtures.thunderbird3;
      expect(rule.matches(wrongCandidate)).to.be.false;
    });
  });

  describe('deny all for Thunderbird', function() {

    it('should apply when candidate product is Thunderbird', function() {
      var rule = defaultRules.denyAllUpgradesForThunderbird;
      var candidate = fixtures.thunderbird3;
      var apply = rule.action.apply;
      apply.should.be.a.function;

      expect(rule.matches(candidate)).to.be.true;
    });

    it('and prepare an empty update list to send back to the client', function() {
      var rule = defaultRules.denyAllUpgradesForThunderbird;
      var candidate = fixtures.thunderbird3;
      var apply = rule.action.apply;

      var result = apply(candidate);
      expect(result).not.to.be.null;
      expect(result.updates).to.be.an.array;
      expect(result.updates).to.have.length(0);
    });

    it('should not apply when candidate product is not Thunderbird', function() {
      var rule = defaultRules.denyAllUpgradesForThunderbird;

      var wrongCandidate = fixtures.firefox3;
      expect(rule.matches(wrongCandidate)).to.be.false;
    });
  });

  after(function() {
    mockery.deregisterAll();
    mockery.disable();
    mockery.resetCache();
  });
});

