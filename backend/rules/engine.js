'use strict';

var DefaultRules = require('./default-rules'),
    Storage = require('./storage'),
    Rule = require('./rule'),
    Loader = require('./loader'),
    async = require('async'),
    db = require('../mongo-provider'),
    events = require('events'),
    util = require('util'),
    config = require('../config'),
    logger = require('../logger');

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

function weightComparator(left, right) {
  return right.weight - left.weight;
}

function initRuleCache(callback) {
  this.storage.findAll({}, function(err, result) {
    if (!err) {
      this.cache = result.map(function(rule) {
          return new Rule(rule);
        }
      ).sort(weightComparator);
    }
    callback(err, this.cache);
  }.bind(this));
};

var Engine = function(db, callback) {
  this.storage = new Storage(db);
  this.cache = [];
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

function addToCache(cache, rule) {
  cache.push(rule);
  cache.sort(weightComparator);
}

function removeFromCache(cache, ruleId) {
  for (var i = 0, len = cache.length; i < len; i++) {
    if (cache[i]._id == ruleId) {
      cache.splice(i, 1);
      return;
    }
  }
}

Engine.prototype.add = function(rule, callback) {
  this.storage.save(rule, function(err, result) {
    addToCache(this.cache, rule);
    callback(err, result);
  }.bind(this));
};

Engine.prototype.update = function(rule, callback) {
  this.storage.update(rule, function(err, result) {
    removeFromCache(this.cache, rule._id);
    addToCache(this.cache, rule);
    callback(err, result);
  }.bind(this));
};

Engine.prototype.remove = function(id, callback) {
  this.storage.remove(id.toString(), function(err, result) {
    removeFromCache(this.cache, id);
    callback(err, result);
  }.bind(this));
};

Engine.prototype.evaluate = function(candidate) {
  for (var i in this.cache) {
    var rule = this.cache[i];

    if (rule.matches(candidate)) {
      logger.debug('Applying rule %s to candidate %s/%s', rule.action.id, candidate.product, candidate.version);
      return rule.action.apply(candidate);
    }
  }

  logger.debug('Applying default rule %s to candidate %s/%s', config.rules.defaultRule, candidate.product, candidate.version);
  return Loader.actions[config.rules.defaultRule].action()(candidate);
};

module.exports = Engine;
