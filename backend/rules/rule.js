'use strict';

var Loader = require('./rules-loader');

var Rule = function(object) {
  this._id = object._id;
  this.summary = object.summary;
  this.description = object.description;
  this.condition = object.condition;
  this.action = object.action;
  this.condition.matches = Loader.conditions[this.condition.id].for(this.condition.parameters);
  this.action.apply = Loader.actions[this.action.id].for(this.action.parameters);
};

module.exports = Rule;
