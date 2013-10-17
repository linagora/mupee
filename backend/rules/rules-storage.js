'use strict';

var util = require('util'),
    Rule = require('./rule'),
    Storage = require('../storage');

var RulesStorage = function(db) {
  this.db = db;
  this.collection = 'rules';
};

util.inherits(RulesStorage, Storage);

function arrayToRule(err, result, callback) {
  if (!err) {
    if (result.length == 1) {
      callback(null, new Rule(result[0]));
    } else if (result.length === 0) {
      callback(null, null);
    } else {
      callback(new Error('more than one result for this query !'), null);
    }
  } else {
    callback(err, null);
  }
}

RulesStorage.prototype.findByProperties = function(rule, callback) {
  this.db.collection('rules').find(
    rule,
    {},
    function(err, cursor) {
      cursor.toArray(function(err, results) {
        arrayToRule(err, results, callback);
      });
    }
  );
};

RulesStorage.prototype.findByPredicate = function(predicate, callback) {
  this.db.collection('rules').find({
      predicate : predicate
    },
    {},
    function(err, cursor) {
      cursor.toArray(function(err, results) {
        arrayToRule(err, results, callback);
      });
    }
  );
};

module.exports = RulesStorage;
