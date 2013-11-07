'use strict';

var expect = require('chai').expect,
    mockery = require('mockery'),
    testLogger = require('../test-logger');

var fixtures;

describe('The Rule module', function() {
  var rule;

  before(function() {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    mockery.registerMock('../../logger', testLogger);
    fixtures = require('./fixtures');
    rule = fixtures.thunderbird10ToLatest17;
  });

  describe('matches method should evaluate a predicate and return', function() {
    it('true if it matches', function() {
      var result = rule.matches({product: 'Thunderbird', branch: 10});
      expect(result).to.be.a('boolean');
      expect(result).to.be.true;
    });

    it('false if it does not match', function() {
      var result = rule.matches({product: 'Firefox', branch: 11});
      expect(result).to.be.a('boolean');
      expect(result).to.be.false;
    });
  });

  it('action.apply should be a function that performs the rule action', function() {
    var apply = rule.action.apply;
    expect(apply).to.be.a.function;
    var result = apply({
      product: 'Thunderbird',
      branch: 10,
      updates: [
        { type: 'major', version: '17.0.1' },
        { type: 'minor', version: '10.0.4' },
        { type: 'major', version: '24.0.1' },
        { type: 'minor', version: '10.0.3' },
        { type: 'major', version: '17.0.4' },
        { type: 'minor', version: '10.0.2' },
        { type: 'minor', version: '10.0.6' },
        { type: 'major', version: '17.0.3' }
      ],
      clearUpdates: function() {
        this.updates = [];
      },
      addUpdate: function(update) {
        this.updates.push(update);
      }
    });
    expect(result).not.to.be.null;
    expect(result).to.be.an.object;
    expect(result.updates).to.be.an.array;
    expect(result.updates).to.have.length(1);
    expect(result.updates[0].version).not.to.be.null;
    expect(result.updates[0].version).to.equal('17.0.4');
  });

  it('weight property should report the weight of this rule (higher weight means higher priority)', function() {
    expect(rule.weight).to.equal(12);
  });

  describe('getInconsistencies method', function() {

    it('should return null if the rule is consistent', function() {
      var rule = fixtures.thunderbird10ToLatest17;
      expect(rule.getInconsistencies()).to.be.null;
    });
    it('should return an array if one rule predicate allowed candidate is incompatible with action allowed candidates', function() {
      var rule = fixtures.invalidRuleAllowedCandidates;
      var inconsistencies = rule.getInconsistencies();
      expect(inconsistencies).to.be.an.array;
      expect(inconsistencies).to.have.length(3);
      expect(inconsistencies[0]).to.be.an.object;
      expect(inconsistencies[0].type).to.equal('candidateTypeMismatch');
      expect(inconsistencies[0].predicate).to.equal('branchEquals');
      expect(inconsistencies[1]).to.be.an.object;
      expect(inconsistencies[1].type).to.equal('candidateTypeMismatch');
      expect(inconsistencies[1].predicate).to.equal('productEquals');
      expect(inconsistencies[2]).to.be.an.object;
      expect(inconsistencies[2].type).to.equal('predicatesCompatibility');
    });

    it('should return false if rule predicates are incompatible with the action', function() {
      var rule = fixtures.invalidRuleNotCompatiblePredicates;
      var inconsistencies = rule.getInconsistencies();
      expect(inconsistencies).to.be.an.array;
      expect(inconsistencies).to.have.length(1);
      expect(inconsistencies[0]).to.be.an.object;
      expect(inconsistencies[0].type).to.equal('predicatesCompatibility');
    });

  });

  after(function() {
    mockery.deregisterAll();
    mockery.disable();
    mockery.resetCache();
  });
});

