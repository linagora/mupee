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
    if (result.length === 1) {
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

RulesStorage.prototype.findByPredicate = function(predicates, callback) {
  this.db.collection('rules').find({
      predicates: predicates
    },
    {},
    function(err, cursor) {
      if (err) {
        return callback(err);
      }
      cursor.toArray(function(err, results) {
        arrayToRule(err, results, callback);
      });
    }
  );
};

RulesStorage.prototype.save = function(rule, callback) {
  RulesStorage.super_.prototype.save.apply(this, [rule, function(err, result) {
    if (err) {
      callback(err, result);
    } else {
      callback(err, new Rule(result));
    }
  }]);
  return this;
};

RulesStorage.prototype.findAll = function(query, callback) {
  RulesStorage.super_.prototype.findAll.apply(this, [query, function(err, results) {
    if (err) {
      callback(err, results);
    } else {
      callback(err, results.map(function(rule) {return new Rule(rule);}));
    }
  }]);
};

RulesStorage.prototype.findById = function(id, callback) {
  RulesStorage.super_.prototype.findById.apply(this, [id, function(err, result) {
    if (err || !result) {
      callback(err, result);
    } else {
      callback(err, new Rule(result));
    }
  }]);
};

RulesStorage.prototype.update = function(rule, callback) {
  RulesStorage.super_.prototype.update.apply(this, [rule, function(err, result) {
    if (err) {
      callback(err, result);
    } else {
      callback(err, new Rule(result));
    }
  }]);
};

module.exports = RulesStorage;
