'use strict';

var util = require('util'),
    Storage = require('./storage');

var ExtensionStorage = function(db) {
  this.db = db;
  this.collection = 'extensions';
};

util.inherits(ExtensionStorage, Storage);

ExtensionStorage.prototype.findByExtension = function(extension, callback) {
  this.db.collection(this.collection).find({
    id: extension.id,
    version: extension.version,
    targetPlatforms: extension.targetPlatforms
  },
  {},
  function(err, cursor) {
    cursor.toArray(callback);
  });
};

module.exports = ExtensionStorage;
