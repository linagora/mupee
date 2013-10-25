'use strict';

var expect = require('chai').expect;

var db = require('../../../backend/mongo-provider'),
    Engine = require('../../../backend/rules/engine'),
    Rule = require('../../../backend/rules/rule'),
    defaults = require('../../../backend/rules/default-rules');

var fixtures = require('./fixtures');

describe('The Rules Engine', function() {
  it('should ensure we have default rules in the database', function(done) {
    db.collection('rules').insert({test: true}, {safe: true}, function(err) {
      if (err) {throw err;}
      db.collection('rules').drop(function(err) {
        if (err) {throw err;}
        new Engine(db, function(err, result) {
          if (err) {throw (err);}
          expect(result).to.be.an.array;
          expect(result).to.have.length(2);
          expect(result[0]).to.be.instanceof(Rule);
          expect(result[1]).to.be.instanceof(Rule);
          done();
        });
      });
    });
  });

  it('should not insert default rules if some exist with the mandatory predicates', function(done) {
    new Engine(db, function(err, result) {
      if (err) {throw err;}
      expect(result).to.be.an.array;
      expect(result).to.have.length(2);
      new Engine(db, function(err, result) {
        if (err) {throw err;}
        expect(result).to.be.an.array;
        expect(result).to.have.length(2);
        expect(result[0]).to.be.instanceof(Rule);
        expect(result[1]).to.be.instanceof(Rule);
        done();
      });
    });
  });

  it('create operation should add the rule to cache', function(done) {
    var engine = new Engine(db, function(err, result) {
      var rule = new Rule(fixtures.thunderbird10ToLatest17);
      rule._id = null;
      engine.add(fixtures.thunderbird10ToLatest17, function(err, result) {
        expect(result).to.be.an.object;
        expect(result).to.have.property('_id');
        expect(result.predicates).to.be.an.array;
        expect(engine.cache).to.have.length(3);
        done();
      });
    });
  });

  it('remove operation should remove the rule to cache', function(done) {
    var engine = new Engine(db, function(err, result) {
      var rule = new Rule(fixtures.thunderbird10ToLatest17);
      rule._id = null;
      engine.add(rule, function(err, result) {
        expect(engine.cache).to.have.length(3);
        engine.remove(result._id, function(err, result) {
          expect(engine.cache).to.have.length(2);
          done();
        });
      });
    });
  });

  it('update operation should update the rule in cache', function(done) {
    var engine = new Engine(db, function(err, result) {
      var rule = new Rule(fixtures.thunderbird10ToLatest17);
      rule._id = null;
      engine.add(rule, function(err, result) {
        expect(engine.cache).to.have.length(3);
        result.action = {id: 'deny', parameters: {}};
        engine.update(result, function(err, result) {
          expect(result.action.id).to.equal('deny');
          expect(engine.cache).to.have.length(3);
          done();
        });
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
    db.close(done);
  });
});
