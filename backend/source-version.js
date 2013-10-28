'use strict';

var querystring = require('querystring'),
    jstoxml = require('./jstoxml'),
    Update = require('./update').Update;

var SourceVersion = function(object) {
  this.timestamp = object.timestamp || Date.now();
  this.product = object.product;
  this.version = object.version;
  this.buildID = object.buildID;
  this.buildTarget = object.buildTarget;
  this.locale = object.locale;
  this.channel = object.channel;
  this.osVersion = object.osVersion;
  this.branch = object.version ? object.version.substring(0, object.version.indexOf('.')) : null;
  this.parameters = object.parameters;
  this.updates = [];
  if (object.updates) {
    object.updates.forEach(function(update) {
      this.updates.push(new Update(update));
    }.bind(this));
  }
};

SourceVersion.prototype.addUpdate = function(update) {
  this.updates.push(update);
};

SourceVersion.prototype.updatesAsXML = function() {
  var updates = [];
  this.updates.forEach(function(update) {
    updates.push(update.asXML());
  });
  return jstoxml.toXML({
    updates: updates
  }, {header: true});
};

SourceVersion.prototype.buildUrl = function(mozUpdateUrl) {
  var path = mozUpdateUrl + '/' + this.product + '/' + this.version + '/' +
      this.buildID + '/' + this.buildTarget + '/' + this.locale + '/' +
      this.channel + '/' + this.osVersion + '/default/default/update.xml';

  if (Object.keys(this.parameters).length) {
    path += '?' + querystring.stringify(this.parameters);
  }
  return path;
};

SourceVersion.prototype.clearUpdates = function() {
  this.updates = [];
};

SourceVersion.prototype.findUpdate = function(update) {
  var updates = this.updates.filter(function(localUpdate) {
    return localUpdate.type === update.type &&
           localUpdate.version === update.version &&
           localUpdate.extensionVersion === update.extensionVersion &&
           localUpdate.displayVersion === update.displayVersion &&
           localUpdate.appVersion === update.appVersion &&
           localUpdate.platformVersion === update.platformVersion &&
           localUpdate.buildID === update.buildID &&
           localUpdate.detailsURL === update.detailsURL;
  });
  return updates.length === 1 ? updates[0] : null;
};

SourceVersion.prototype.findPatch = function(update, patch) {
  var localUpdate = this.findUpdate(update);
  if (!localUpdate) {
    return null;
  }
  var patches = localUpdate.patches.filter(function(localPatch) {
    return localPatch.type === patch.type &&
           localPatch.URL === patch.URL &&
           localPatch.localPath === patch.localPath &&
           localPatch.hashFunction === patch.hashFunction &&
           localPatch.hashValue === patch.hashValue &&
           localPatch.size === patch.size;
  });
  return patches.length === 1 ? patches[0] : null;
};

module.exports = SourceVersion;
