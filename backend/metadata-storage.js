'use strict';

var BSON = require('mongodb').BSONPure;

var MetadataStorage = function(db) {
  this.db = db;
};

MetadataStorage.prototype.save = function(version, callback) {
  this.db.collection('source-versions').save(version, {safe: true}, callback);
  return this;
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
      cursor.nextObject(callback);
    });
};

MetadataStorage.prototype.findAll = function(query, callback) {
  this.db.collection('source-versions').find(query, {}).toArray(callback);
};

MetadataStorage.prototype.findById = function(id, callback) {
  this.db.collection('source-versions').findOne({'_id': new BSON.ObjectID(id)}, callback);
};

MetadataStorage.prototype.update = function(id, sourceVersion, callback) {
  this.db.collection('source-versions').update(
     {'_id': new BSON.ObjectID(id)}, sourceVersion, {safe: true}, callback);
};

module.exports = MetadataStorage;
