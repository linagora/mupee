'use strict';

var DefaultRules = require('./default-rules'),
    RulesStorage = require('./storage'),
    Loader = require('./loader'),
    async = require('async');


function ensureRuleByPredicate(rule) {
  var storage = this.storage;
  return function(callback) {
    storage.findByPredicate(rule.predicate, function(err, result){
      if (err) {
        callback(err, null);
      } else {
        if (!result) {
          storage.save(rule, function(err, result) {
            if (err){
              callback(err, null);
            } else {
              callback(null, result);
            }
          });
        } else{
          callback(null, null);
        }
      }
    });
  };
}

var RulesEngine = function(db, callback) {

  this.storage = new RulesStorage(db);
  var operations = DefaultRules.list.map(ensureRuleByPredicate.bind(this));

  async.series(operations, callback);
};

RulesEngine.prototype.listActions = function () {
  return Loader.actions;
};

RulesEngine.prototype.findByPredicate = function (predicate, callback) {
  this.storage.findByPredicate(predicate, callback);
};

RulesEngine.prototype.create = function (rule, callback) {
  this.storage.save(rule, callback);
};

RulesEngine.prototype.update = function (id, rule, callback) {
  this.storage.update(id, rule, callback);
};

RulesEngine.prototype.delete = function (id, callback) {
  this.storage.remove(id, callback)
};

module.exports = RulesEngine;
