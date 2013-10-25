'use strict';

var DefaultRules = require('./default-rules'),
    Storage = require('./storage'),
    Rule = require('./rule'),
    Loader = require('./loader'),
    async = require('async');

function ensureRuleByPredicate(rule) {
  var storage = this.storage;

  return function(callback) {
    storage.findByPredicate(rule.predicates, function(err, result){
      if (err || result) {
        callback(err, result)
      } else {
        storage.save(rule, function(err, result) {
          callback(err, result);
        });
      }
    });
  };
};

function initRuleCache(callback) {
  this.storage.findAll({}, function(err, result) {
    if (!err) {
      this.ruleList = result.map(function(rule) {
          return new Rule(rule);
        }
      ).sort(function(left, right) {
        return right.weight - left.weight;
      });
    }
    callback(err, this.ruleList);
  }.bind(this));
};

var Engine = function(db, callback) {
  this.storage = new Storage(db);
  this.ruleList = [];
  this.db = db;

  async.series(
    DefaultRules.list.map(ensureRuleByPredicate.bind(this)),
    function(err, result) {
      if (err) callback(err, result);
      initRuleCache.bind(this)(callback);
    }.bind(this)
  );
};

Engine.prototype.listActions = function() {
  return Loader.actions;
};

Engine.prototype.listPredicates = function() {
  return Loader.predicates;
}

Engine.prototype.findByPredicate = function(predicates, callback) {
  this.storage.findByPredicate(predicates, callback);
};

Engine.prototype.create = function(rule, callback) {
  this.storage.save(rule, callback);
};

Engine.prototype.update = function(rule, callback) {
  this.storage.update(rule, callback);
};

Engine.prototype.remove = function(id, callback) {
  this.storage.remove(id, callback);
};

module.exports = Engine;
