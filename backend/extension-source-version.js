'use strict';

var jstoxml = require('./jstoxml');

var ExtensionTargetApplication = function(object) {
  this.id = object.id || null;
  this.minVersion = object.minVersion || null;
  this.maxVersion = object.maxVersion || null;
  this.updateLink = object.updateLink || null;
  this.updateInfoURL = object.updateInfoURL || null;
  this.updateHash = object.updateHash || null;
};

var ExtensionUpdate = function(object) {
  this.version = object.version || null;
  this.targetApplication = new ExtensionTargetApplication(object.targetApplication || {});
};

var ExtensionSourceVersion = function(object) {
  this.timestamp = object.timestamp || Date.now();
  this.reqVersion = object.reqVersion || null;
  this.id = object.id || null;
  this.version = object.version || null;
  this.status = object.status || null;
  this.appID = object.appID || null;
  this.appVersion = object.appVersion || null;
  this.appOS = object.appOS || null;
  this.appABI = object.appABI || null;
  this.currentAppVersion = object.currentAppVersion || null;
  this.maxAppVersion = object.maxAppVersion || null;
  this.locale = object.locale || null;
  this.updateType = object.updateType || null;
  this.compatMode = object.compatMode || null;

  this.updates = [];
  if (object.updates) {
    object.updates.forEach(function(update) {
      this.updates.push(new ExtensionUpdate(update));
    }.bind(this));
  }
};

ExtensionSourceVersion.prototype.addUpdate = function(update) {
  this.updates.push(update);
};

ExtensionSourceVersion.prototype.updatesAsRDF = function() {
  var updateDescriptions = [], metaDescriptions = [];

  this.updates.forEach(function(update) {
    metaDescriptions.push({
      _name: 'RDF:li',
      _attrs: {
        resource: 'urn:mozilla:extension:' + this.id + ':' + update.version
      }
    });
    updateDescriptions.push({
      _name: 'RDF:Description',
      _attrs: {
        about: 'urn:mozilla:extension:' + this.id + ':' + update.version
      },
      _content: {
        'em:version': update.version,
        'em:targetApplication': {
          _name: 'RDF:Description',
          _content: {
            'em:id': update.targetApplication.id,
            'em:minVersion': update.targetApplication.minVersion,
            'em:maxVersion': update.targetApplication.maxVersion,
            'em:updateLink': update.targetApplication.updateLink,
            'em:updateInfoURL': update.targetApplication.updateInfoURL,
            'em:updateHash': update.targetApplication.updateHash
          }
        }
      }
    });
  }.bind(this));

  return jstoxml.toXML({
    _name: 'RDF:RDF',
    _attrs: {
      'xmlns:RDF': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      'xmlns:em': 'http://www.mozilla.org/2004/em-rdf#'
    },
    _content: [
      {
        _name: 'RDF:Description',
        _attrs: {
          about: 'urn:mozilla:extension:' + this.id
        },
        _content: {
          _name: 'em:updates',
          _content: {
            _name: 'RDF:Seq',
            _content: metaDescriptions
          }
        }
      },
      updateDescriptions
    ]
  },
  {
    header: true,
    indent: '  ', // Two spaces
    ignoreNullAttrs: true
  });
};

module.exports = {
  ExtensionSourceVersion: ExtensionSourceVersion,
  ExtensionUpdate: ExtensionUpdate,
  ExtensionTargetApplication: ExtensionTargetApplication
};
