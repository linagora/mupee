'use strict';

var DefaultRules = require('./default-rules'),
    Storage = require('./rules-storage'),
    Loader = require('./loader'),
    async = require('async');

function ensureRuleByPredicate(rule) {
  var storage = this.storage;
  return function(callback) {
    storage.findByPredicate(rule.predicate, function(err, result) {
      if (err) {
        callback(err, null);
      } else {
        if (!result) {
          storage.save(rule, function(err, result) {
            callback(err, result);
          });
        } else {
          callback(null, null);
        }
      }
    });
  };
}

var Engine = function(db, callback) {

  this.storage = new Storage(db);
  var operations = DefaultRules.list.map(ensureRuleByPredicate.bind(this));

  async.series(operations, callback);
};

Engine.prototype.listActions = function() {
  return Loader.actions;
};

Engine.prototype.findByPredicate = function(predicate, callback) {
  this.storage.findByPredicate(predicate, callback);
};

Engine.prototype.create = function(rule, callback) {
  this.storage.save(rule, callback);
};

Engine.prototype.update = function(id, rule, callback) {
  this.storage.update(id, rule, callback);
};

Engine.prototype.delete = function(id, callback) {
  this.storage.remove(id, callback);
};

module.exports = Engine;
