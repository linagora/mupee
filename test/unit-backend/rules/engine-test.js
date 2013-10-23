'use strict';

var expect = require('chai').expect;

var db = require('../../../backend/mongo-provider'),
    Engine = require('../../../backend/rules/engine'),
    Rule = require('../../../backend/rules/rule'),
    defaults = require('../../../backend/rules/default-rules');

describe('The Rules Engine', function() {
  it('should ensure we have default rules in the database', function(done) {
    db.collection('rules').insert({test: true}, {safe: true}, function(err) {
      if (err) {
        throw err;
      }
      db.collection('rules').drop(function(err) {
        if (err) {
          throw err;
        }
        var engine = new Engine(db, function(err, result) {
          if (err) throw(err);
          expect(result).to.be.an.array;
          expect(result).to.have.length(2);
          expect(result[0]).to.be.a.Rule;
          expect(result[1]).to.be.a.Rule;
          done();
        });
      });
    });
  });

  it('should not try to insert the default rules if some already exist with the same predicate', function(done) {
    new Engine(db, function(err, result) {
      if (err) { throw err; }
      expect(result).to.be.an.array;
      expect(result).to.have.length(2);
      new Engine(db, function(err, result) {
        if (err) { throw err; }
        expect(result).to.be.an.array;
        expect(result).to.have.length(2);
        expect(result[0]).to.be.null;
        expect(result[1]).to.be.null;
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
    db.close(done);
  });
});
