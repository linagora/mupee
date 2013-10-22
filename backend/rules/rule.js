'use strict';

var Loader = require('./loader');
var Errors = require("../application-errors");
var validateRuleObject = require("./validation").validateRuleObject;

var Rule = function(object) {
  validateRuleObject(object);
  this._id = object._id;
  this.predicates = object.predicates;
  this.predicates.forEach(function(p) {
    p.matches = Loader.predicates[p.id].for(p.parameters);
  });
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
