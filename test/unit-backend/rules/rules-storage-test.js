'use strict';

var chai = require('chai');

var expect = chai.expect;

var DbProvider = require('../../../backend/mongo-provider'),
  RulesStorage = require('../../../backend/rules/rules-storage');

var db = DbProvider.db();

describe('The RulesStorage module', function() {
  var manager = new RulesStorage(db);

  var rules = {
    ruleName: 'aRule'
  };

  var newRule = {
    ruleName: 'aNewRule'
  };

  var id;

  beforeEach(function(done) {
    manager.save(rules, function(err, result) {
      id = result._id;
      done();
    });
  });

  it('should allow adding a rules to persistent storage', function(done) {
    db.collection('rules').findOne({ _id: id }, {}, function(err, record) {
      if (err) throw err;
      expect(record).to.exist;
      expect(record).to.have.property('_id');
      expect(record.ruleName).to.equal('aRule');
      done();
    });
  });

  it('should allow finding rules by property from persistent storage', function(done) {
    manager.findByVersion({ruleName: 'aRule'}, function(err, records) {
      if (err) throw err;
      expect(records).to.be.an.array;
      expect(records).to.have.length(1);
      expect(records[0]).to.exist;
      expect(records[0]).to.have.property('_id');
      expect(records[0]).to.have.property('ruleName');
      done();
    });
  });

/*  it('should allow replacing a rule in persistent storage', function(done) {
    manager.save(newRule, function(err, updated) {
      expect(updated).to.equal(1);
      manager.findById(id, function(err, updatedRecord) {
        if (err) throw err;é
        expect(records).to.be.an.array;
        expect(records).to.have.length(1);
        expect(updatedRecord[0]).to.exist;
        expect(updatedRecord[0].ruleName).to.equal('aNewRule');
        done();
      });
    });
  });*/

  afterEach(function(done) {
    db.collection('rules').drop(done);
  });

  after(function() {
    db.close();
  });
});
