'use strict';

var Loader = require('./rules-loader');

var Rule = function(object) {
  this._id = object._id;
  this.summary = object.summary;
  this.description = object.description;
  this.predicate = object.predicate;
  this.action = object.action;
  this.predicate.matches = Loader.predicates[this.predicate.id].for(this.predicate.parameters);
  this.action.apply = Loader.actions[this.action.id].for(this.action.parameters);
};

module.exports = Rule;
