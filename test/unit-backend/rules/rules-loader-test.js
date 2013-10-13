var expect = require('chai').expect;

var Loader = require('../../../backend/rules/rules-loader'),
    RuleAction = require('../../../backend/rules/rule-action'),
    RuleCondition = require('../../../backend/rules/rule-condition');

describe('The Rule Loader module', function() {
  describe('dynamically loads modules from file system and', function() {
    it('should fail on non-existing path', function() {
      try {
        Loader.loadModules('./none', '/../thisisanonexisting/path', Object);
      } catch (err) {
        expect(err).not.to.be.null;
      }
    });

    it('should fail if path is not a directory', function() {
      try {
        Loader.loadModules('./conditions', './backend/rules/rule.js', Object);
      } catch (err) {
        expect(err).not.to.be.null;
      }
    });

    it('should succeed and provide modules if it is a directory', function() {
      var modules = Loader.loadModules('./conditions', './backend/rules/conditions/', Object);
      expect(modules).to.be.an.object;
    });
  });

  it('should load actions from the backend/rules/actions directory', function() {
    var actions = Loader.loadActions();
    expect(actions).to.be.an.object;
    expect(Object.keys(actions).length).to.be.at.least(1);
  });

  it('should load conditions from the backend/rules/condtions directory', function() {
    var conditions = Loader.loadConditions();
    expect(conditions).to.be.an.object;
    expect(Object.keys(conditions).length).to.be.at.least(1);
  });

  it('should export a condition map', function() {
    var conditions = Loader.conditions;
    expect(conditions).to.be.an.object;
    expect(Object.keys(conditions).length).to.be.at.least(1);
    for (condition in conditions) {
      expect(condition).to.be.a.RuleCondition;
    }
  });

  it('should export an action map', function() {
    var actions = Loader.actions;
    expect(actions).to.be.an.object;
    expect(Object.keys(actions).length).to.be.at.least(1);
    for (action in actions) {
      expect(action).to.be.a.RuleAction;
    }
  });
});

