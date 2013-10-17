'use strict';

var RulesEngine = function() {}

RulesEngine.prototype.listActions = function () {};
RulesEngine.prototype.findByPredicate = function (predicate, callback) {};
RulesEngine.prototype.create = function (rule, callback) {};
RulesEngine.prototype.update = function (id, rule, callback) {};
RulesEngine.prototype.delete = function (id, callback) {};

module.exports = RulesEngine;