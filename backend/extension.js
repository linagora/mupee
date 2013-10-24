'use strict';

var ExtensionTargetApplication = require('./extension-source-version').ExtensionTargetApplication,
    Errors = require('./application-errors'),
    util = require('util');

function validateExtensionObject(object) {
  if (!object) {
    throw new Errors.BadContructorArgumentError('Extension');
  }

  var requiredProperties = ['id', 'version', 'targetApplications'];

  requiredProperties.forEach(function(property) {
    if (!object[property]) {
      throw new Errors.PropertyMissingError('Extension', property);
    }
  });

  if (!util.isArray(object.targetApplications)) {
    throw new Errors.BadPropertyTypeError('Extension', 'targetApplications', 'Array');
  }

  if (object.targetApplications.length < 1) {
    throw new Errors.NotEnoughElementsError('targetApplications', 1);
  }
}

var Extension = function(object) {
  validateExtensionObject(object);

  this.id = object.id;
  this.version = object.version;
  this.name = object.name || null;
  this.description = object.description || null;
  this.creator = object.creator || null;
  this.homepageURL = object.homepageURL || null;
  this.iconURL = object.iconURL || null;
  this.targetPlatforms = object.targetPlatforms || [];
  this.targetApplications = object.targetApplications.map(function(targetApplication) {
    return new ExtensionTargetApplication(targetApplication);
  });
};

module.exports = {
  Extension: Extension
};
