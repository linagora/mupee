'use strict';

var chai = require('chai');

var expect = chai.expect;

var DbProvider = require('../../../backend/mongo-provider'),
  RulesStorage = require('../../../backend/rules/rules-storage'),
  fixtures = require('./rule-fixtures'),
  defaultRules = require('../../../backend/rules/default-rules');

var db = DbProvider.db();

describe('The Rules Storage module', function() {
  var manager = new RulesStorage(db);

  var rule = defaultRules.denyAllUpgradeForFirefox;

  var id;

  beforeEach(function(done) {
    manager.save(rule, function(err, result) {
      id = result._id;
      done();
    });
  });

  it('should allow adding a rules to persistent storage', function(done) {
    db.collection('rules').findOne({ _id: id }, {}, function(err, record) {
      if (err) throw err;
      expect(record).to.exist;
      expect(record).to.have.property('_id');
      expect(record.summary).to.equal('Deny all upgrade for Firefox');
      done();
    });
  });

  it('should allow finding rules by property from persistent storage', function(done) {
    manager.findByProperties({summary: 'Deny all upgrade for Firefox'}, function(err, record) {
      if (err) throw err;
      expect(record).to.exist;
      expect(record).to.have.property('_id');
      expect(record).to.have.property('summary');
      expect(record).to.have.property('description');
      expect(record).to.have.property('predicate');
      expect(record).to.have.property('action');
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

  it('should allow finding rules by predicate from persistent storage', function(done) {
    manager.findByPredicate({
        id : 'productEquals',
        parameters : { product : 'Firefox' }
      }, function(err, record) {
        if (err) throw err;
        expect(record).to.exist;
        expect(record).to.have.property('_id');
        expect(record).to.have.property('summary');
        expect(record.summary).to.equal('Deny all upgrade for Firefox');
        expect(record).to.have.property('description');
        expect(record).to.have.property('predicate');
        expect(record).to.have.property('action');
        done();
    });
  });

  afterEach(function(done) {
    db.collection('rules').drop(done);
  });

  after(function() {
    db.close();
  });
});
