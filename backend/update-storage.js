'use strict';

var util = require('util'),
    Storage = require('./storage');

var UpdateStorage = function(db) {
  this.db = db;
  this.collection = 'source-versions';
};

util.inherits(UpdateStorage, Storage);

UpdateStorage.prototype.findByVersion = function(version, callback) {
  this.db.collection('source-versions').find({
    product: version.product,
    buildId: version.buildId,
    buildTarget: version.buildTarget,
    locale: version.locale,
    channel: version.channel,
    osVersion: version.osVersion,
    branch: version.branch
  },
  {},
  function(err, cursor) {
    cursor.nextObject(callback);
  });
};

module.exports = UpdateStorage;
