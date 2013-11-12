'use strict';

var Errors = require('./application-errors'),
    util = require('util');

function validateInstructionObject(name, object, requiredProperties) {
  if (!name || !object) {
    throw new Errors.BadContructorArgumentError('Instruction');
  }

  if (requiredProperties && requiredProperties.length) {
    requiredProperties.forEach(function(property) {
      if (!object[property]) {
        throw new Errors.PropertyMissingError('Instruction', property);
      }
    });
  }
}

var ChromeManifest = function(object) {
  this.instructions = object.instructions || [];
};

var Instruction = function(name, object, requiredProperties) {
  validateInstructionObject(name, object, requiredProperties);

  this.name = name;
  this.flags = object.flags || [];
};

var BinaryComponentInstruction = function(object) {
  Instruction.call(this, 'binary-component', object, ['path']);

  this.path = object.path;
};
util.inherits(BinaryComponentInstruction, Instruction);

var ManifestInstruction = function(object) {
  Instruction.call(this, 'manifest', object, ['path']);

  this.path = object.path;
};
util.inherits(ManifestInstruction, Instruction);

exports = module.exports = {
  ChromeManifest: ChromeManifest,
  ManifestInstruction: ManifestInstruction,
  BinaryComponentInstruction: BinaryComponentInstruction
};
