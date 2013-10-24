'use strict';

var ExtensionTargetApplication = require('./extension-source-version').ExtensionTargetApplication;

var Extension = function(object) {
  this.id = object.id || null;
  this.name = object.name || null;
  this.version = object.version || null;
  this.description = object.description || null;
  this.creator = object.creator || null;
  this.homepageURL = object.homepageURL || null;
  this.iconURL = object.iconURL || null;
  this.targetPlatforms = object.targetPlatforms || [];

  this.targetApplications = [];
  if (object.targetApplications) {
    object.targetApplications.forEach(function(targetApplication) {
      this.targetApplications.push(new ExtensionTargetApplication(targetApplication));
    }.bind(this));
  }
};

module.exports = {
  Extension: Extension
};
