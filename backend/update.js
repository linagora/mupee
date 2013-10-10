'use strict';

var jstoxml = require('./jstoxml'),
    config = require('./config');

var Patch = function(object) {
  this.type = object.type;
  this.url = object.url;
  this.localPath = object.localPath || null;
  this.hashFunction = object.hashFunction;
  this.hashValue = object.hashValue;
  this.size = object.size;
};

var Update = function(object) {
  this.type = object.type;
  this.version = object.version;
  this.extensionVersion = object.extensionVersion;
  this.displayVersion = object.displayVersion;
  this.appVersion = object.appVersion;
  this.platformVersion = object.platformVersion;
  this.buildId = object.buildId;
  this.detailsUrl = object.detailsUrl;
  this.patches = [];
  if (object.patches) {
    object.patches.forEach(function(patch) {
      this.patches.push(new Patch(patch));
    }.bind(this));
  }
};

Update.prototype.addPatch = function(patch) {
  this.patches.push(patch);
};

Update.prototype.clearPatches = function() {
  this.patches = [];
};

Update.prototype.asXML = function() {
  var patches = [];
  this.patches.forEach(function(patch) {
    patches.push({
      _name: 'patch',
      _attrs: {
      type: patch.type,
      URL: patch.localPath ? config.server.url + ':' + config.server.port + '/download/' + patch.localPath : patch.url,
      hashFunction: patch.hashFunction,
      hashValue: patch.hashValue,
      size: patch.size
      }
    });
  });

  var update = {
    _name: 'update',
    _attrs: {
      type: this.type,
      version: this.version,
      extensionVersion: this.extensionVersion,
      displayVersion: this.displayVersion,
      appVersion: this.appVersion,
      platformVersion: this.platformVersion,
      buildID: this.buildId,
      detailsURL: this.detailsUrl
    },
    _content: patches
  };

  return jstoxml.toXML(update, {
    filter: {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&apos;',
      '&': '&amp;'
    },
    ignoreNullAttrs : true
  });
};

module.exports = {
  Update: Update,
  Patch: Patch
};

