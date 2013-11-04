'use strict';

var Loader = require('./loader'),
    Errors = require('../application-errors'),
    logger = require('../logger');

function validateParameter(parameterDefinition, value) {
  if (value === null) {
    throw new Errors.BadParameterTypeError(parameterDefinition.id, parameterDefinition.type);
  }
  var type = typeof value;
  if (type !== parameterDefinition.type) {
    throw new Errors.BadParameterTypeError(parameterDefinition.id, parameterDefinition.type);
  }
  return true;
}

function validateComponentObject(component, definition) {
  var parameterDefinition;
  for (var i in definition.parametersDefinitions) {
    parameterDefinition = definition.parametersDefinitions[i];
    var componentParameterValue;
    var componentParameterExists = (parameterDefinition.id in component.parameters);

    if (componentParameterExists) {
      componentParameterValue = component.parameters[parameterDefinition.id];
    }

    if (!componentParameterExists && parameterDefinition.mandatory) {
      throw new Errors.MandatoryParameterError(parameterDefinition.id);
    }
    validateParameter(parameterDefinition, componentParameterValue);
  }
  var keys = Object.keys(component.parameters);
  var callback = function(param) {
    return param.id === keys[j];
  };
  for (var j in keys) {
    parameterDefinition = definition.parametersDefinitions.filter(callback);
    if (parameterDefinition.length !== 1) {
      throw new Errors.UnknownParameterError(keys[i]);
    }
  }

  return true;
}

function validatePredicateObject(predicate) {
  if (!predicate.id) {
    throw new Errors.PropertyMissingError('predicate', 'id');
  }
  if (!predicate.parameters) {
    throw new Errors.PropertyMissingError('predicate', 'parameter');
  }
  if (!Loader.predicates[predicate.id]) {
    throw new Errors.UnknownPredicateError(predicate.id);
  }
  var definition = Loader.predicates[predicate.id];
  return validateComponentObject(predicate, definition);
}

function validateActionObject(action) {
  if (!action.id) {
    throw new Errors.PropertyMissingError('action', 'id');
  }
  if (!action.parameters) {
    throw new Errors.PropertyMissingError('action', 'parameter');
  }
  if (!Loader.actions[action.id]) {
    throw new Errors.UnknownActionError(action.id);
  }
  var definition = Loader.actions[action.id];
  return validateComponentObject(action, definition);
}

function validateRuleObject(object) {
  if (!object) {
    throw new Errors.BadContructorArgumentError('rule');
  }
  if (!object.predicates || !('forEach' in object.predicates)) {
    throw new Errors.BadPropertyTypeError('rule', 'predicates', 'array');
  }
  for (var i in object.predicates) {
    validatePredicateObject(object.predicates[i]);
  }
  if (!object.action) {
    throw new Errors.PropertyMissingError('rule', 'action');
  }
  validateActionObject(object.action);
  return true;
}

function validateRuleObjectAndLogException(object) {
  try {
    return validateRuleObject(object);
  } catch (e) {
    logger.debug('validation failed', e.stack);
    throw e;
  }
}

exports = module.exports = {
  validateRuleObject: validateRuleObjectAndLogException,
  validatePredicateObject: validatePredicateObject,
  validateActionObject: validateActionObject
};
