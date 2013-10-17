'use strict';

var chai = require('chai'),
    async = require('async');

var BSON = require('mongodb').BSONPure;

var expect = chai.expect;

var db = require('../../../backend/mongo-provider'),
    RulesStorage = require('../../../backend/rules/storage');

var fixtures = require('./fixtures'),
    defaultRules = require('../../../backend/rules/default-rules');

describe('The Rules Storage module', function() {

  var manager = new RulesStorage(db);
  var rules = {
    rule : defaultRules.denyAllUpgradesForFirefox,
    ruleToModify : defaultRules.denyAllUpgradesForThunderbird,
    ruleToDelete : fixtures.versionTenToLatestMinor
  };

  beforeEach(function(done) {

    Object.keys(rules).forEach(function(key) {
      delete rules[key]._id;
    });
    async.series(Object.keys(rules).map(function(key) {
      return (function(callback) {
        manager.save(rules[key], function(err, result) {
          rules[key]._id = result._id;
          callback(err, result);
        });
      });
    }),
    function (err, result) {
      done();
    });
  });

  it('should allow adding a rules to persistent storage', function(done) {
    manager.findById(rules.rule._id.toString(), function(err, record) {
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

  it('should allow replacing a rule in persistent storage', function(done) {
    var replacingRule = rules.ruleToModify;

    replacingRule.summary = 'a replacing rule';
    manager.save(replacingRule, function(err, updated) {
      expect(updated).to.equal(1);
      manager.findById(replacingRule._id.toString(), function(err, record) {
        if (err) throw err;
        expect(record).to.exist;
        expect(record.summary).to.equal('a replacing rule');
        done();
      });
    });
  });

  it('should allow updating a rule in persistent storage', function(done) {
    var updatedRuleFields = {};

    updatedRuleFields.description = 'an updated description';
    manager.update(rules.ruleToModify._id.toString(), updatedRuleFields, function(err, record) {
      if (err) throw err;
      expect(record).to.equal(1);
      manager.findById(rules.ruleToModify._id.toString(), function(err, record) {
        if (err) throw err;
        expect(record).to.exist;
        expect(record.description).to.equal(updatedRuleFields.description);
        done();
      })
    });
  });

  it('should allow deleting a rule from persistent storage', function(done) {
    manager.remove(rules.ruleToDelete._id.toString(), function(err, result) {
      if (err) throw err;
      manager.findById(rules.ruleToDelete._id.toString(), function(err, record) {
        if (err) throw err;
        expect(record).to.be.null;
        done();
      });
    });
  });

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
