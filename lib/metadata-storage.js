'use strict';

var assert = require('assert');

var MetadataStorage = function(db) {
  this.db = db;
};

MetadataStorage.prototype.save = function(version, callback) {
  this.db.collection('source-versions').save(version, {safe: true}, callback);
};

MetadataStorage.prototype.findByVersion = function(version, callback) {
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
      cursor.toArray(callback);
    });
};

module.exports = MetadataStorage;
