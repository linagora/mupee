'use strict';

var util = require('util'),
    Storage = require('./storage');

var ExtensionUpdateStorage = function(db) {
  this.db = db;
  this.collection = 'extension-source-versions';
};

util.inherits(ExtensionUpdateStorage, Storage);

ExtensionUpdateStorage.prototype.findByVersion = function(version, callback) {
  this.db.collection(this.collection).find({
    reqVersion: version.reqVersion,
    id: version.id,
    version: version.version,
    status: version.status,
    appID: version.appID,
    appVersion: version.appVersion,
    appOS: version.appOS,
    appABI: version.appABI,
    currentAppVersion: version.currentAppVersion,
    maxAppVersion: version.maxAppVersion,
    locale: version.locale,
    updateType: version.updateType,
    compatMode: version.compatMode
  },
  {},
  function(err, cursor) {
    cursor.toArray(callback);
  });
};

module.exports = ExtensionUpdateStorage;
