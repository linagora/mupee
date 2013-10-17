'use strict';

var expect = require('chai').expect;

var db = require('../../../backend/mongo-provider'),
    RulesStorage = require('../../../backend/rules/storage'),
    RulesEngine = require('../../../backend/rules/engine'),
    Rule = require('../../../backend/rules/rule');

describe('The Rules Engine', function() {
  var storage = new RulesStorage(db);

  it('should ensure we have default rules in the database', function(done) {
    var engine = new RulesEngine(db, function(err, result) {
      if (err) throw(err);
      expect(result).to.be.an.array;
      expect(result).to.have.length(2);
      expect(result[0]).to.be.a.Rule;
      expect(result[1]).to.be.a.Rule;
      done();
    });
  });

  it('should not try to insert the default rules if some already exist with the same predicate', function(done) {
    var engine = new RulesEngine(db, function(err, result) {
      if (err) throw err;
      expect(result).to.be.an.array;
      expect(result).to.have.length(2);
      var otherEngineThatWillTryToInsertDefaultsAgain = new RulesEngine(db, function(err, result) {
        if (err) throw err;
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
