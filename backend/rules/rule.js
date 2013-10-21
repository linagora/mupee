'use strict';

var Loader = require('./loader');

var Rule = function(object) {
  this._id = object._id;
  this.summary = object.summary;
  this.description = object.description;
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
