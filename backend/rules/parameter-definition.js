'use strict';

var RuleParameterDef = function(object) {
  this.summary = object.summary;
  this.description = object.description;
  this.type = object.type;
  this.mandatory = object.mandatory;
  this.defaultValue = object.defaultValue;
};

module.exports = RuleParameterDef;
