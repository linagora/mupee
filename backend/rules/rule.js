'use strict';

var Rule = function(object) {
  this.summary = object.summary;
  this.description = object.description;
  this.condition = object.condition;
  this.action = object.action;
  this.parameters = object.parameters || {};
};

Rule.prototype.isSatisfiedBy = function(candidate) {
  return this.condition(candidate);
};

Rule.prototype.getAction = function() {
  return this.action;
};

module.exports = Rule;
