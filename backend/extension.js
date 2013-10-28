'use strict';

var ExtensionTargetApplication = require('./extension-source-version').ExtensionTargetApplication,
    Errors = require('./application-errors'),
    util = require('util'),
    mvc = require('mozilla-version-comparator');

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

Extension.prototype.canBeInstalledOn = function(platform) {
  if (!platform) {
    throw new Errors.MandatoryParameterError('platform');
  }

  if (!this.targetPlatforms.length) {
    return true;
  }

  for (var i in this.targetPlatforms) {
    if (platform.match('^' + this.targetPlatforms[i])) {
      return true;
    }
  }

  return false;
};

Extension.prototype.canBeInstalledOnOSAndArch = function(os, arch) {
  if (!os) {
    throw new Errors.MandatoryParameterError('os');
  }

  if (!arch) {
    throw new Errors.MandatoryParameterError('arch');
  }

  return this.canBeInstalledOn(os + '_' + arch);
};

Extension.prototype.getCompatibleTargetApplication = function(id, version) {
  for (var i in this.targetApplications) {
    var app = this.targetApplications[i];

    if (app.id === id && mvc(version, app.minVersion) >= 0 && mvc(version, app.maxVersion) <= 0) {
      return app;
    }
  }

  return null;
};

module.exports = {
  Extension: Extension
};
