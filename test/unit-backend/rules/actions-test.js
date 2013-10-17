'use strict';

var expect = require('chai').expect;
require('chai').should();

var Loader = require('../../../backend/rules/loader'),
    defaultRules = require('../../../backend/rules/default-rules');

describe('The rule actions', function() {

  it('block all versions upgrade for product equal Firefox', function() {
    var rule = defaultRules.denyAllUpgradesForFirefox;
    var apply = rule.action.apply;
    apply.should.be.a.function;
    var result = apply({ updates : [
      { type : 'major', version : '17.0.1' },
      { type : 'major', version : '24.0.1' },
      { type : 'minor', version : '10.0.6' }
    ]});
    expect(result).not.to.be.null;
    expect(result).to.be.an.array;
    expect(result.length).to.equal(0);
  });

  it('block all versions upgrade for product equal Thunderbird', function() {
    var rule = defaultRules.denyAllUpgradesForThunderbird;
    var apply = rule.action.apply;
    apply.should.be.a.function;
    var result = apply({ updates : [
      { type : 'major', version : '17.0.1' },
      { type : 'major', version : '24.0.1' },
      { type : 'minor', version : '10.0.6' }
    ]});
    expect(result).not.to.be.null;
    expect(result).to.be.an.array;
    expect(result.length).to.equal(0);
  });
});

