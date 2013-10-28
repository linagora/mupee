var util = require('util');

var AbstractError = function (msg, constr) {
  Error.captureStackTrace(this, constr || this);
  this.message = msg || 'Error';
}
util.inherits(AbstractError, Error);
AbstractError.prototype.name = 'Abstract Error';


var UnknownActionError = function (actionId) {
  var msg = "The action "+actionId+" is unknown";
    this.id = actionId;
  UnknownActionError.super_.call(this, msg, this.constructor);
}
util.inherits(UnknownActionError, AbstractError);
UnknownActionError.prototype.name = 'Unknown Action';


var UnknownPredicateError = function (predicateId) {
  var msg = "The predicate "+predicateId+" is unknown";
    this.id = predicateId;
  UnknownPredicateError.super_.call(this, msg, this.constructor);
}
util.inherits(UnknownPredicateError, AbstractError);
UnknownPredicateError.prototype.name = 'Unknown predicate';


var BadPropertyTypeError = function (objName, propertyName, propertyType) {
  var msg = "A "+objName+" "+propertyName+" property should be a "+propertyType;
  this.id = objName;
  this.propertyName = propertyName;
  this.propertyType = propertyType;
  BadPropertyTypeError.super_.call(this, msg, this.constructor);
}
util.inherits(BadPropertyTypeError, AbstractError);
BadPropertyTypeError.prototype.name = 'Bad property type';


var BadContructorArgumentError = function (objName) {
  var msg = "Bad arguments for "+objName+" constructor";
  this.id = objName;
  BadContructorArgumentError.super_.call(this, msg, this.constructor);
}
util.inherits(BadContructorArgumentError, AbstractError);
BadContructorArgumentError.prototype.name = 'Bad constructor argument';


var PropertyMissingError = function (objName, propertyName) {
  var msg = "The object "+objName+" needs a property "+propertyName;
  this.id = objName;
  this.propertyName = propertyName;
  PropertyMissingError.super_.call(this, msg, this.constructor);
}
util.inherits(PropertyMissingError, AbstractError);
PropertyMissingError.prototype.name = 'Missing property';


var MandatoryParameterError = function (id) {
  var msg = "The parameter "+id+" is mandatory";
  this.id = id;
  MandatoryParameterError.super_.call(this, msg, this.constructor);
}
util.inherits(MandatoryParameterError, AbstractError);
MandatoryParameterError.prototype.name = 'Mandatory parameter';


var BadParameterTypeError = function (id, type) {
  var msg = "The parameter "+id+" should be a "+type;
  this.id = id;
  this.parameterType = type;
  BadParameterTypeError.super_.call(this, msg, this.constructor);
}
util.inherits(BadParameterTypeError, AbstractError);
BadParameterTypeError.prototype.name = 'Bad parameter type';


var UnknownParameterError = function (id) {
  var msg = "The parameter "+id+" is unknown";
    this.id = id;
  UnknownParameterError.super_.call(this, msg, this.constructor);
}
util.inherits(UnknownParameterError, AbstractError);
UnknownParameterError.prototype.name = 'Unknown parameter';

var UnknownSourceVersionUpdateError = function (id) {
  var msg = "The SourceVersion update buildID " + id + " is unknown";
    this.id = id;
  UnknownSourceVersionUpdateError.super_.call(this, msg, this.constructor);
}
util.inherits(UnknownSourceVersionUpdateError, AbstractError);
UnknownSourceVersionUpdateError.prototype.name = 'Unknown SourceVersion Update';

module.exports = {
  UnknownActionError: UnknownActionError,
  UnknownPredicateError: UnknownPredicateError,
  BadPropertyTypeError: BadPropertyTypeError,
  BadContructorArgumentError: BadContructorArgumentError,
  PropertyMissingError: PropertyMissingError,
  MandatoryParameterError: MandatoryParameterError,
  BadParameterTypeError: BadParameterTypeError,
  UnknownParameterError: UnknownParameterError,
  UnknownSourceVersionUpdateError: UnknownSourceVersionUpdateError
}
