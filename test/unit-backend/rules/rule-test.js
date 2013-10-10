'use strict';

var expect = require('chai').expect;
require('chai').should();

var SourceVersion = require('../../../backend/source-version'),
    Rule = require('../../../backend/rules/rule'),
    fixtures = require('./rule-fixtures');

describe('The Rule module', function() {
  describe('matches() method should evaluate a predicate and return', function() {
    var rule = fixtures.versionsUpToTenToLatestMinor;
    it('false if it does not match', function(done) {
      var result = rule.isSatisfiedBy({ branch : 9 });
      expect(result).to.be.a('boolean');
      expect(result).to.be.true;
      done();
    });

    it('true if it matches', function(done) {
      var result = rule.isSatisfiedBy({ branch : 11 });
      expect(result).to.be.a('boolean');
      expect(result).to.be.false;
      result.should.be.a.boolean;
      done();
    });
  });

  it('getAction() method should return a function that performs an action', function(done) {
    var rule = fixtures.versionsUpToTenToLatestMinor;
    var action = rule.getAction();
    action.should.be.a.function;
    var result = action({ updates : [
      { type : 'major', version : 17 },
      { type : 'minor', version : 2 },
      { type : 'major', version : 24 },
      { type : 'minor', version : 3 },
      { type : 'minor', version : 1 },
      { type : 'minor', version : 6 }
    ]});
    result.should.not.be.null;
    result.should.be.an.object;
    expect(result.version).to.equal(6);
    done();
  });
});

