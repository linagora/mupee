'use strict';

var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    mockery = require('mockery');
var rules;

describe('The rules-server module', function() {

  before(function() {
    mockery.enable({warnOnUnregistered: false, useCleanCache: true});
  });

  it('should return the rule when created', function(done) {
    var rule = {
      id: 'rule-id',
      predicate: {
        id: 'productEquals',
        parameters: [
          {
            id: 'product',
            value: 'Thunderbird'
          }
        ]
      },
      action: {
        id: 'action3',
        parameters: [
          {
            id: 'branch',
            value: '24'
          }
        ]
      }
    };
    var Engine = function () {};
    Engine.prototype.create = function(rule, callback) { callback(null, rule) };

    mockery.registerMock('../../rules-engine', Engine);
    rules = require('../../backend/routes/admin/rules');

    rules.create({
      body: {
        rule: rule
      }
    }, {
      send: function (result) {
        result.should.deep.equal(rule);
        done();
      }
    });
  });

  it('should send 400 when there\'s no rule in a create request', function(done) {
    rules.create({
      body: {}
    }, {
      send: function (result) {
        result.should.equal(400);
        done();
      }
    });
  });

  it('should send 500 when there\'s an error in a create request', function(done) {
    var Engine = function () {};
    Engine.prototype.create = function(rule, callback) { callback('oh my god!') };

    mockery.registerMock('../../rules-engine', Engine);
    rules = require('../../backend/routes/admin/rules');

    rules.create({
      body: {
        rule: {}
      }
    }, {
      send: function (result) {
        result.should.equal(500);
        done();
      }
    });
  });

  it('should return the rule when updated', function(done) {
    var rule = {
      id: 'rule-id',
      predicate: {
        id: 'productEquals',
        parameters: [
          {
            id: 'product',
            value: 'Thunderbird'
          }
        ]
      },
      action: {
        id: 'action3',
        parameters: [
          {
            id: 'branch',
            value: '24'
          }
        ]
      }
    };
    var Engine = function () {};
    Engine.prototype.update = function(id, rule, callback) { callback(null, rule) };

    mockery.registerMock('../../rules-engine', Engine);
    rules = require('../../backend/routes/admin/rules');

    rules.update({
      params: {
        id: 'ruleid'
      },
      body: {
        rule: rule
      }
    }, {
      send: function (result) {
        result.should.deep.equal(rule);
        done();
      }
    });
  });

  it('should send 400 when there\'s no rule in a modify request', function(done) {
    rules.create({
      params: {
        id: 'ruleid'
      },
      body: {}
    }, {
      send: function (result) {
        result.should.equal(400);
        done();
      }
    });
  });

  it('should send 500 when there\'s an error in a update request', function(done) {
    var Engine = function () {};
    Engine.prototype.update = function(id, rule, callback) { callback('oh my god!') };

    mockery.registerMock('../../rules-engine', Engine);
    rules = require('../../backend/routes/admin/rules');

    rules.update({
      params: {
        id: 'ruleid'
      },
      body: {
        rule: {}
      }
    }, {
      send: function (result) {
        result.should.equal(500);
        done();
      }
    });
  });

  it('should send 404 when rule doesn\'t exist in a update request', function(done) {
    var Engine = function () {};
    Engine.prototype.update = function(id, rule, callback) { callback(null, null) };

    mockery.registerMock('../../rules-engine', Engine);
    rules = require('../../backend/routes/admin/rules');

    rules.update({
      params: {
        id: 'ishouldntexist'
      },
      body: {
        rule: {}
      }
    }, {
      send: function (result) {
        result.should.equal(404);
        done();
      }
    });
  });

  it('should return 200 when a rule is deleted', function(done) {
    var Engine = function () {};
    Engine.prototype.delete = function(id, callback) { callback(null, true) };

    mockery.registerMock('../../rules-engine', Engine);
    rules = require('../../backend/routes/admin/rules');

    rules.delete({
      params: {
        id: 'ruleid'
      },
      body: {
        rule: null
      }
    }, {
      send: function (result) {
        result.should.equal(200);
        done();
      }
    });
  });

  it('should return 404 when a rule doesn\'t exist in a delete request', function(done) {
    var Engine = function () {};
    Engine.prototype.delete = function(id, callback) { callback(null, false) };

    mockery.registerMock('../../rules-engine', Engine);
    rules = require('../../backend/routes/admin/rules');

    rules.delete({
      params: {
        id: 'ruleid'
      },
      body: {
        rule: null
      }
    }, {
      send: function (result) {
        result.should.equal(404);
        done();
      }
    });
  });

  it('should return 500 when there\'s an error in a delete request', function(done) {
    var Engine = function () {};
    Engine.prototype.delete = function(id, callback) { callback('oh my god!') };

    mockery.registerMock('../../rules-engine', Engine);
    rules = require('../../backend/routes/admin/rules');

    rules.delete({
      params: {
        id: 'ruleid'
      },
      body: {
        rule: null
      }
    }, {
      send: function (result) {
        result.should.equal(500);
        done();
      }
    });
  });

  it('should return the list of available actions', function(done) {
    var threeActions = [
      {
        id: 'action1',
        summary: 'Block all',
        description: 'Prevents all clients from upgrading'
      },
      {
        id: 'action2',
        summary: 'Upgrade to latest version',
        description: 'Allows clients to upgrade to the latest minor version of the latest branch',
      },
      {
        id: 'action3',
        summary: 'Upgrade to given version',
        description: 'Allows clients to upgrade to the latest minor version of a given branch',
        parameters: [
        {
          id: 'branch',
          summary: 'Target branch',
          description: 'The target branch',
          type: 'number',
            mandatory: true
          }
        ]
      }
    ];
    var Engine = function () {};
    Engine.prototype.listActions = function() { return threeActions; };

    mockery.registerMock('../../rules-engine', Engine);
    rules = require('../../backend/routes/admin/rules');

    rules.listActions({}, {
      json: function (result) {
        result.should.deep.equal(threeActions);
        done();
      }
    });
  });

  it('should return an empty list to a listAction request when there\'s no actions', function(done) {
    var Engine = function () {};
    Engine.prototype.listActions = function() { return []; };

    mockery.registerMock('../../rules-engine', Engine);
    rules = require('../../backend/routes/admin/rules');

    rules.listActions({}, {
      json: function (result) {
        result.should.deep.equal([]);
        done();
      }
    });
  });

  it('should send 400 when there\'s no predicate in a findRuleByPredicate request', function(done) {
    rules.findByPredicate({
      body: {}
    }, {
      send: function (result) {
        result.should.equal(400);
        done();
      }
    });
  });

  it('should send 404 when there\'s no rule matching a findRuleByPredicate request', function(done) {
    var Engine = function () {};
    Engine.prototype.findByPredicate = function(predicate, callback) { callback(null, null); };

    mockery.registerMock('../../rules-engine', Engine);
    rules = require('../../backend/routes/admin/rules');

    rules.findByPredicate({
      body: {
        predicate: {}
      }
    }, {
      send: function (result) {
        result.should.equal(404);
        done();
      }
    });
  });

  it('should send 500 when there\'s an error in a findRuleByPredicate request', function(done) {
    var Engine = function () {};
    Engine.prototype.findByPredicate = function(predicate, callback) { callback('oh my god!'); };

    mockery.registerMock('../../rules-engine', Engine);
    rules = require('../../backend/routes/admin/rules');

    rules.findByPredicate({
      body: {
        predicate: {}
      }
    }, {
      send: function (result) {
        result.should.equal(500);
        done();
      }
    });
  });

  it('should return the rule in a findRuleByPredicate request', function(done) {
    var rule = {
      id: 'rule-id',
      predicate: {
        id: 'productEquals',
        parameters: [
          {
            id: 'product',
            value: 'Thunderbird'
          }
        ]
      },
      action: {
        id: 'action3',
        parameters: [
          {
            id: 'branch',
            value: '24'
          }
        ]
      }
    };
    var Engine = function () {};
    Engine.prototype.findByPredicate = function(predicate, callback) { callback(null, rule);
    };

    mockery.registerMock('../../rules-engine', Engine);
    rules = require('../../backend/routes/admin/rules');

    rules.findByPredicate({
      body: {
        predicate: {}
      }
    }, {
      send: function (result) {
        result.should.deep.equal(rule);
        done();
      }
    });
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
  });

  after(function() {
    mockery.disable();
  });

});

