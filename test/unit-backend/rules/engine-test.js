'use strict';

var expect = require('chai').expect;

var db = require('../../../backend/mongo-provider'),
    Engine = require('../../../backend/rules/engine');

describe('The Rules Engine', function() {

  it('should ensure we have default rules in the database', function(done) {
    new Engine(db, function(err, result) {
      if (err) { throw err; }
      expect(result).to.be.an.array;
      expect(result).to.have.length(2);
      expect(result[0]).to.be.a.Rule;
      expect(result[1]).to.be.a.Rule;
      done();
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
    db.collection('rules').drop(done);
  });
});
