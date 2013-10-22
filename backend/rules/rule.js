'use strict';

var Loader = require('./loader');
var Errors = require("../application-errors");


function validateRuleObject(object) {
  if (!object) {
    throw new Errors.BadContructorArgumentError("rule");
  }
  if (!object.predicates || !("forEach" in object.predicates)) {
    throw new Errors.BadPropertyTypeError("rule","predicates","array");
  }
  for (var i in object.predicates) {
    validatePredicateObject(object.predicates[i]);
  }
  if ( !object.action ) {
    throw new Errors.PropertyMissingError("rule","action");
  }
  validateActionObject(object.action);
};

function validatePredicateObject(predicate) {
  if (!p.id) {
    throw new Errors.PropertyMissingError("predicate", "id");
  }
  if (!p.parameters) {
    throw new Errors.PropertyMissingError("predicate", "parameter");
  }
  if (!Loader.predicates[p.id]) {
    throw new Errors.UnknownPredicateError(p.id);
  }
  var definition = Loader.predicates[p.id];
  
  for (var i in definition.parametersDefinitions) {
    var parameterDefinition = definition.parametersDefinitions[i];
    var componentParameterValue;
    var componentParameterExists = (parameterDefinition.id in predicate.parameters);
    if ( componentParameterExists ) {
      componentParameterValue = predicate.parameters[parameterDefinition.id];
    }

    if (!componentParameterExists && parameterDefinition.mandatory ) {
      throw new Errors.MandatoryParameterError(parameterDefinition.id);
    }
    validateParameter(parameterDefinition, componentParameterValue);
  }
  return true;
};

function validatePredicateObject(predicate) {
  if (!predicate.id) {
    throw new Errors.PropertyMissingError("predicate", "id");
  }
  if (!predicate.parameters) {
    throw new Errors.PropertyMissingError("predicate", "parameter");
  }
  if (!Loader.predicates[predicate.id]) {
    throw new Errors.UnknownPredicateError(predicate.id);
  }
  var definition = Loader.predicates[predicate.id];
  return validateComponentObject(predicate, definition);
};

function validateActionObject(action) {
  if (!action.id) {
    throw new Errors.PropertyMissingError("action", "id");
  }
  if (!action.parameters) {
    throw new Errors.PropertyMissingError("action", "parameter");
  }
  if (!Loader.actions[action.id]) {
    throw new Errors.UnknownActionError(action.id);
  }
  var definition = Loader.actions[action.id];
  return validateComponentObject(action, definition);
};

function validateComponentObject(component, definition) {
  for (var i in definition.parametersDefinitions) {
    var parameterDefinition = definition.parametersDefinitions[i];
    var componentParameterValue;
    var componentParameterExists = (parameterDefinition.id in component.parameters);
    
    if ( componentParameterExists ) {
      componentParameterValue = component.parameters[parameterDefinition.id];
    }

    if (!componentParameterExists && parameterDefinition.mandatory ) {
      throw new Errors.MandatoryParameterError(parameterDefinition.id);
    }
    validateParameter(parameterDefinition, componentParameterValue);
  }
  console.log(component.parameters, Object.keys(component.parameters));
  var keys = Object.keys(component.parameters);
  for (var i in keys) {
    var parameterDefinition = definition.parametersDefinitions.filter(function(param) {
      return param.id == keys[i];
    });
    if ( parameterDefinition.length != 1 ) {
      throw new Errors.UnknownParameterError(keys[i]);
    }
  }

  return true;
};

function validateParameter(parameterDefinition, value) {
  if ( value === null ) {
    throw new Errors.BadParameterTypeError(parameterDefinition.id, parameterDefinition.type);
  }
  var type = typeof value;
  if ( type != parameterDefinition.type ) {
    throw new  Errors.BadParameterTypeError(parameterDefinition.id, parameterDefinition.type);
  }
  return true;
};

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
