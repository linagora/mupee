'use strict';

var Loader = require('./loader');
var validateRuleObject = require('./validation').validateRuleObject;

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
  this.action.apply = Loader.actions[this.action.id].for (this.action.parameters);
};

Rule.prototype.matches = function(candidate) {
  var match = true;
  this.predicates.forEach(function(p) {
    match = match && p.matches(candidate);
  });
  return match;
};

Rule.prototype.getInconsistencies = function() {
  var action = Loader.actions[this.action.id],
      inconsistencies = [];

  this.predicates.forEach(function(p) {
    var predicate = Loader.predicates[p.id];
    if (action.allowedCandidates.indexOf(predicate.allowedCandidate) < 0) {
      inconsistencies.push({
        type: 'candidateTypeMismatch',
        action: action.id,
        predicate: predicate.id
      });
    }
  });

  if (!action.isCompatibleWithPredicates(this.predicates)) {
    inconsistencies.push({
      type: 'predicatesCompatibility',
      action: action.id,
      predicates: this.predicates.map(function(predicate) { return predicate.id; })
    });
  }

  return inconsistencies.length ? inconsistencies : null;
};

module.exports = Rule;
