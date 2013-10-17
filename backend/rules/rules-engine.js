'use strict';

var defaultRules = require('./rule-fixtures'),
    DbProvider = require('../../../backend/mongo-provider'),
    RulesStorage = require('./rules-storage'),
    async = require('async');

var RulesEngine = function() {}

RulesEngine.init = function (callbackAllFinished) {
  var rules = defaultRules.list;
  var db = DbProvider.db();
  var manager = new RulesStorage(db);
  var operations = [];

  for (rule in rules) {
    operations.push(
      function (callback) {
        RulesStorage.findByPredicate(rule.predicate, function(err, results){
          if (err) {
            callback(err, null);
          } else {
            if (!results.length) {
              manager.save(rule, function(err, result) {
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
      }
    );
  }
  async.series(operations, callbackAllFinished);
};

RulesEngine.prototype.listActions = function () {};

RulesEngine.prototype.findByPredicate = function (predicate, callback) {

};

RulesEngine.prototype.create = function (rule, callback) {};
RulesEngine.prototype.update = function (id, rule, callback) {};
RulesEngine.prototype.delete = function (id, callback) {};

module.exports = RulesEngine;
