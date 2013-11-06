'use strict';

var expect = require('chai').expect,
    mockery = require('mockery'),
    testLogger = require('../test-logger');

var db,
    Rule,
    defaults;

var fixtures;

describe('The Rules Engine', function() {

  before(function() {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    mockery.registerMock('../../logger', testLogger);
    db = require('../../../backend/mongo-provider');
    Rule = require('../../../backend/rules/rule');
    defaults = require('../../../backend/rules/default-rules');
    fixtures = require('./fixtures');
  });

  it('should ensure we have default rules in the database', function(done) {
    db.collection('rules').insert({test: true}, {safe: true}, function(err) {
      if (err) {throw err;}
      db.collection('rules').drop(function(err) {
        var engine = require('../../../backend/rules/engine');

        engine.on('cacheLoaded', function(err, result) {
          if (err) {throw (err);}
          expect(result).to.be.an.array;
          expect(result).to.have.length(4);
          result.forEach(function(rule) {
            expect(rule).to.be.instanceof(Rule);
          });
          done();
        });
      });
    });
  });

  it('create operation should add the rule to cache', function(done) {
    var engine = require('../../../backend/rules/engine');
    var rule = new Rule(fixtures.thunderbird10ToLatest17);
    rule._id = null;

    engine.create(fixtures.thunderbird10ToLatest17, function(err, result) {
      expect(result).to.be.an.object;
      expect(result).to.have.property('_id');
      expect(result.predicates).to.be.an.array;
      expect(engine.cache).to.have.length(5);
      done();
    });
  });

  it('remove operation should remove the rule to cache', function(done) {
    var engine = require('../../../backend/rules/engine');
    var rule = new Rule(fixtures.thunderbird10ToLatest17);
    rule._id = null;

    engine.create(rule, function(err, result) {
      expect(engine.cache).to.have.length(6);
      engine.remove(result._id, function(err, result) {
        expect(engine.cache).to.have.length(5);
        done();
      });
    });
  });

  it('update operation should update the rule in cache', function(done) {
    var engine = require('../../../backend/rules/engine');
    var rule = new Rule(fixtures.thunderbird10ToLatest17);
    rule._id = null;

    engine.create(rule, function(err, result) {
      expect(engine.cache).to.have.length(6);
      result.action = {id: 'deny', parameters: {}};
      engine.update(result, function(err, result) {
        expect(result.action.id).to.equal('deny');
        expect(engine.cache).to.have.length(6);
        done();
      });
    });
  });

  afterEach(function(done) {
    defaults.list.forEach(function(rule) {
      rule._id = null;
    });
    db.collection('rules').drop(done);
  });

  after(function(done) {
    mockery.deregisterAll();
    mockery.disable();
    mockery.resetCache();
    db.close(done);
  });
});
