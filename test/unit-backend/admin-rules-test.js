'use strict';

require('chai').should();

var mockery = require('mockery'),
    testLogger = require('./test-logger');

describe('The Rules Server module', function() {

  function compatibleWithEverything(predicates) {
    return true;
  }

  var rule = {
    _id: 'rule-id',
    summary: '',
    description: '',
    predicates: [{
      id: 'productEquals',
      parameters: {
        product: 'Thunderbird'
      }
    }],
    action: {
      id: 'action3',
      parameters: {}
    }
  };

  var serverRule = {
    _id: 'rule-id',
    summary: '',
    description: '',
    predicates: [{
      id: 'productEquals',
      parameters: {
        product: 'Thunderbird'
      }
    }],
    action: {
      id: 'action3',
      parameters: {}
    }
  };

  beforeEach(function() {
    mockery.enable({warnOnUnregistered: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    var Loader = {
      predicates: {
        productEquals: {
          id: 'productEquals',
          summary: 'product equals',
          description: 'true if product matches with candidate',
          predicate: function(candidate, parameters) {
            if (candidate.product === parameters.product) {
              return true;
            } else {
              return false;
            }
          },
          parametersDefinitions: [{
            id: 'product',
            summary: 'product name',
            description: 'a Mozilla product name',
            type: 'string',
            mandatory: true
          }],
          for: function(object) { return function() { return true; };}
        }
      },
      actions: {
        action3: {
          id: 'action3',
          summary: 'deny upgrades',
          description: 'This policy disable all upgrades',
          action: function(parameters) {
            return function(version) {
              version.clearUpdates();
              return version;
            };
          },
          parametersDefinitions: [],
          for: function(object) { return function() { return null; };}
        }
      }
    };
    mockery.registerMock('./loader', Loader);
  });

  it('should return the rule when created', function(done) {
    mockery.registerMock('../../rules/engine', {
      create: function(rule, callback) { callback(null, serverRule); }
    });
    var rules = require('../../backend/routes/admin/rules');

    rules.create({
      body: {
        rule: rule
      }
    }, {
      send: function(result, details) {
        result.should.deep.equal(serverRule);
        done();
      }
    });
  });

  it('should send 400 when there is no rule in a create request', function(done) {
    mockery.registerMock('../../rules/engine', {});
    var rules = require('../../backend/routes/admin/rules');

    rules.create({
      body: {}
    }, {
      send: function(result, details) {
        result.should.equal(400);
        done();
      }
    });
  });

  it('should send 500 when there is an error in a create request', function(done) {
    mockery.registerMock('../../rules/engine', {
      create: function(rule, callback) { callback('oh my god!'); }
    });
    var rules = require('../../backend/routes/admin/rules');

    rules.create({
      body: {
        rule: rule
      }
    }, {
      send: function(result) {
        result.should.equal(500);
        done();
      }
    });
  });

  it('should return the rule when updated', function(done) {
    mockery.registerMock('../../rules/engine', {
      update: function(rule, callback) { callback(null, serverRule); }
    });
    var rules = require('../../backend/routes/admin/rules');

    rules.update({
      params: {
        id: 'rule-id'
      },
      body: {
        rule: rule
      }
    }, {
      send: function(result) {
        result.should.deep.equal(serverRule);
        done();
      }
    });
  });

  it('should send 400 when there is no rule in a modify request', function(done) {
    mockery.registerMock('../../rules/engine', {});
    var rules = require('../../backend/routes/admin/rules');

    rules.create({
      params: {
        id: 'ruleid'
      },
      body: {}
    }, {
      send: function(result) {
        result.should.equal(400);
        done();
      }
    });
  });

  it('should send 500 when there is an error in a update request', function(done) {
    mockery.registerMock('../../rules/engine', {
      update: function(rule, callback) { callback('oh my god!'); }
    });
    var rules = require('../../backend/routes/admin/rules');

    rules.update({
      params: {
        id: 'rule-id'
      },
      body: {
        rule: rule
      }
    }, {
      send: function(result) {
        result.should.equal(500);
        done();
      }
    });
  });

  it('should send 404 when rule does not exist in a update request', function(done) {
    mockery.registerMock('../../rules/engine', {
      update: function(rule, callback) { callback(null, null); }
    });
    var rules = require('../../backend/routes/admin/rules');

    rules.update({
      params: {
        id: 'ishouldntexist'
      },
      body: {
        rule: rule
      }
    }, {
      send: function(result) {
        result.should.equal(404);
        done();
      }
    });
  });

  it('should return 200 when a rule is deleted', function(done) {
    mockery.registerMock('../../rules/engine', {
      remove: function(id, callback) { callback(null, true); }
    });
    var rules = require('../../backend/routes/admin/rules');

    rules.delete({
      params: {
        id: 'rule-id'
      },
      body: {
        rule: null
      }
    }, {
      send: function(result) {
        result.should.equal(200);
        done();
      }
    });
  });

  it('should return 404 when a rule does not exist in a delete request', function(done) {
    mockery.registerMock('../../rules/engine', {
      remove: function(id, callback) { callback(null, false); }
    });
    var rules = require('../../backend/routes/admin/rules');

    rules.delete({
      params: {
        id: 'rule-id'
      },
      body: {
        rule: null
      }
    }, {
      send: function(result) {
        result.should.equal(404);
        done();
      }
    });
  });

  it('should return 500 when there is an error in a delete request', function(done) {
    mockery.registerMock('../../rules/engine', {
      remove: function(id, callback) { callback('oh my god!'); }
    });
    var rules = require('../../backend/routes/admin/rules');

    rules.delete({
      params: {
        id: 'ruleid'
      },
      body: {
        rule: null
      }
    }, {
      send: function(result) {
        result.should.equal(500);
        done();
      }
    });
  });

  it('should return the list of available actions', function(done) {
    var threeActions = {
      action1: {
        id: 'action1',
        summary: 'Block all',
        description: 'Prevents all clients from upgrading',
        isCompatibleWithPredicates: compatibleWithEverything
      },
      action2: {
        id: 'action2',
        summary: 'Upgrade to latest version',
        description: 'Allows clients to upgrade to the latest minor version of the latest branch',
        isCompatibleWithPredicates: compatibleWithEverything
      },
      action3: {
        id: 'action3',
        summary: 'Upgrade to given version',
        description: 'Allows clients to upgrade to the latest minor version of a given branch',
        parametersDefinitions: [
          {
            id: 'branch',
            summary: 'Target branch',
            description: 'The target branch',
            type: 'number',
            mandatory: true
          }
        ],
        isCompatibleWithPredicates: compatibleWithEverything
      }
    };

    mockery.registerMock('../../rules/engine', {
      listActions: function() { return threeActions; }
    });
    var rules = require('../../backend/routes/admin/rules');

    rules.listActions({
      body: {
        predicates: [{
          id: 'productEquals',
          parameters: {
            product: 'Thunderbird'
          }
        }]
      }
    }, {
      json: function(result) {
        result.should.deep.equal(threeActions);
        done();
      }
    });
  });

  it('should send 400 when there\'s no predicates in a listActions request', function(done) {
    mockery.registerMock('../../rules/engine', {
      listActions: function() { return []; }
    });
    var rules = require('../../backend/routes/admin/rules');

    rules.listActions({}, {
      send: function(data) {
        data.should.equal(400);
        done();
      }
    });
  });

  it('should send 400 when the predicates array is empty in a listActions request', function(done) {
    mockery.registerMock('../../rules/engine', {
      listActions: function() { return []; }
    });
    var rules = require('../../backend/routes/admin/rules');

    rules.listActions({
      body: {
        predicates: []
      }
    }, {
      send: function(data) {
        data.should.equal(400);
        done();
      }
    });
  });

  it('should send 400 when one of the predicates is invalid in a listActions request', function(done) {
    mockery.registerMock('../../rules/engine', {
      listActions: function() { return []; }
    });
    var rules = require('../../backend/routes/admin/rules');

    rules.listActions({
      body: {
        predicates: [{
          id: 'unknownPredicate'
        }]
      }
    }, {
      send: function(data) {
        data.should.equal(400);
        done();
      }
    });
  });

  it('should return an empty list to a listAction request when there is no actions', function(done) {
    mockery.registerMock('../../rules/engine', {
      listActions: function() { return {}; }
    });
    var rules = require('../../backend/routes/admin/rules');

    rules.listActions({
      body: {
        predicates: [{
          id: 'productEquals',
          parameters: {product: 'Firefox'}
        }]
      }
    }, {
      json: function(result) {
        result.should.deep.equal({});
        done();
      }
    });
  });

  it('should return only compatible actions to a listAction request', function(done) {
    mockery.registerMock('../../rules/engine', {
      listActions: function() { return {
                                  action1: {
                                    id: 'action1',
                                    summary: 'Block all',
                                    description: 'Prevents all clients from upgrading',
                                    isCompatibleWithPredicates: compatibleWithEverything
                                  },
                                  action2: {
                                    id: 'action2',
                                    summary: 'Upgrade to latest version',
                                    description: 'Allows clients to upgrade to the latest minor version of the latest branch',
                                    isCompatibleWithPredicates: function() { return false; }
                                  }
                                };
                              }
    });
    var rules = require('../../backend/routes/admin/rules');

    rules.listActions({
      body: {
        predicates: [{
          id: 'productEquals',
          parameters: {product: 'Firefox'}
        }]
      }
    }, {
      json: function(result) {
        result.should.deep.equal({
          action1: {
            id: 'action1',
            summary: 'Block all',
            description: 'Prevents all clients from upgrading',
            isCompatibleWithPredicates: compatibleWithEverything
          }
        });
        done();
      }
    });
  });

  it('should send 400 when there is no body in the request', function(done) {
    mockery.registerMock('../../rules/engine', {});
    var rules = require('../../backend/routes/admin/rules');

    rules.findByPredicate({
    }, {
      send: function(result) {
        result.should.equal(400);
        done();
      }
    });
  });

  it('should send 400 when there is no predicate in a findByPredicate request', function(done) {
    mockery.registerMock('../../rules/engine', {});
    var rules = require('../../backend/routes/admin/rules');

    rules.findByPredicate({
      body: {}
    }, {
      send: function(result) {
        result.should.equal(400);
        done();
      }
    });
  });

  it('should send 404 when there is no rule matching a findByPredicate request', function(done) {
    mockery.registerMock('../../rules/engine', {
      findByPredicate: function(predicate, callback) { callback(null, null); }
    });
    var rules = require('../../backend/routes/admin/rules');

    rules.findByPredicate({
      body: {
        predicates: [{
          id: 'productEquals',
          parameters: {product: 'Firefox'}
        }]
      }
    }, {
      send: function(result, details) {
        result.should.equal(404);
        done();
      }
    });
  });

  it('should send 500 when there is an error in a findByPredicate request', function(done) {
    mockery.registerMock('../../rules/engine', {
      findByPredicate: function(predicate, callback) { callback(new Error('oh my god!')); }
    });
    var rules = require('../../backend/routes/admin/rules');

    rules.findByPredicate({
      body: {
        predicates: [{
          id: 'productEquals',
          parameters: {product: 'Firefox'}
        }]
      }
    }, {
      send: function(result) {
        result.should.equal(500);
        done();
      }
    });
  });

  it('should return the rule in a findByPredicate request', function(done) {
    mockery.registerMock('../../rules/engine', {
      findByPredicate: function(predicate, callback) { callback(null, serverRule); }
    });
    var rules = require('../../backend/routes/admin/rules');

    rules.findByPredicate({
      body: {
        predicates: [{
          id: 'productEquals',
          parameters: {product: 'Thunderbird'}
        }]
      }
    }, {
      send: function(result) {
        result.should.deep.equal(serverRule);
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

