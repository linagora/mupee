'use strict';

var chai = require('chai'),
    expect = chai.expect;

var db = require('../../../backend/mongo-provider'),
    Storage = require('../../../backend/rules/storage'),
    Rule = require('../../../backend/rules/rule');

var defaultRules = require('../../../backend/rules/default-rules');

describe('The Rules Storage module', function() {

  var manager = new Storage(db);

  before(function(done) {
    db.collection('rules').drop(function() {done();});
  });


  it('should allow adding a rules to persistent storage', function(done) {
    var rule = new Rule(defaultRules.denyAllUpgradesForFirefox);
    manager.save(rule, function(err, record) {
      if (err) { throw err; }
      expect(record).to.exist;
      expect(record).to.have.property('_id');
      manager.findById(record._id.toString(), function(err, record) {
        if (err) { throw err; }
        expect(record).to.exist;
        expect(record).to.have.property('_id');
        expect(record).to.have.property('predicates');
        expect(record).to.have.property('action');
        expect(record.action).to.have.property('parameters');
        expect(record.action).to.have.property('id');
        done();
      });
    });
  });

  it('should allow replacing a rule in persistent storage', function(done) {
    var ruleToReplace = new Rule(defaultRules.denyAllUpgradesForFirefox);
    manager.save(ruleToReplace, function(err, ruleToReplace) {
      if (err) { throw err; }
      ruleToReplace.action = null;
      manager.save(ruleToReplace, function(err, updated) {
        if (err) { throw err; }
        expect(updated).to.deep.equal(ruleToReplace);
        manager.findById(ruleToReplace._id.toString(), function(err, record) {
          if (err) { throw err; }
          expect(record).to.exist;
          expect(record).to.have.property('_id');
          expect(record._id).to.deep.equal(ruleToReplace._id);
          expect(record).to.have.property('action');
          expect(record.action).to.be.null;
          done();
        });
      });
    });
  });

  it('should allow updating a rule in persistent storage', function(done) {
    var ruleToUpdate = new Rule(defaultRules.denyAllUpgradesForFirefox);
    var updatedRuleFields = {};

    updatedRuleFields.predicates = [];
    manager.save(ruleToUpdate, function(err, ruleToUpdate) {
      if (err) { throw err; }
      ruleToUpdate.predicates = [];
      manager.update(ruleToUpdate, function(err, record) {
        if (err) { throw err; }
        expect(record).to.exist;
        manager.findById(ruleToUpdate._id.toString(), function(err, record) {
          if (err) { throw err; }
          expect(record).to.exist;
          expect(record).to.have.property('predicates');
          expect(record.predicates).to.be.an.array;
          expect(record.predicates).to.have.length(0);
          done();
        });
      });
    });
  });

  it('should allow deleting a rule from persistent storage', function(done) {
    var ruleToDelete = new Rule(defaultRules.denyAllUpgradesForFirefox);

    manager.save(ruleToDelete, function(err, record) {
      if (err) { throw err; }
      manager.remove(ruleToDelete._id.toString(), function(err, result) {
        if (err) { throw err; }
        manager.findById(ruleToDelete._id.toString(), function(err, record) {
          if (err) { throw err; }
          expect(record).to.be.null;
          done();
        });
      });
    });
  });

  it('should allow finding rules by predicate from persistent storage', function(done) {
    var ruleToFind = new Rule(defaultRules.denyAllUpgradesForFirefox);

    manager.save(ruleToFind, function(err, record) {
      if (err) { throw err; }
      manager.findByPredicate([{
        id: 'productEquals',
        parameters: { product: 'Firefox' }
      }], function(err, record) {
        if (err) { throw err; }
        expect(record).to.have.property('_id');
        expect(record).to.have.property('predicates');
        expect(record).to.have.property('action');
        expect(record.action).to.have.property('parameters');
        expect(record.action).to.have.property('id');
        done();
      });
    });
  });

  afterEach(function(done) {
    db.collection('rules').drop(done);
  });

  after(function() {
    db.close();
  });
});
