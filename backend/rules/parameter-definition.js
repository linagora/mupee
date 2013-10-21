'use strict';

var ParameterDef = function(object) {
  this.id = object.id;
  this.summary = object.summary;
  this.description = object.description;
  this.type = object.type;
  this.mandatory = object.mandatory;
  this.defaultValue = object.defaultValue;
};

module.exports = ParameterDef;
