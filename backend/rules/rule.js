'use strict';

var Loader = require('./loader');
var Errors = require("../application-errors");
var validateRuleObject = require("./validation").validateRuleObject;

var Rule = function(object) {
  validateRuleObject(object);
  this._id = object._id;
  this.predicates = object.predicates;
  this.weight = 0;
  this.predicates.forEach(function(p) {
    var loadedPredicates = Loader.predicates[p.id];
    p.matches = loadedPredicates.for(p.parameters);
    this.weight += loadedPredicates.weight;
  }.bind(this));
  this.action = object.action;
  this.action.apply = Loader.actions[this.action.id].for(this.action.parameters);
};

Rule.prototype.matches = function(candidate) {
  var match = true;
  this.predicates.forEach(function(p) {
    match = match && p.matches(candidate);
  });
  return match;
}

module.exports = Rule;
