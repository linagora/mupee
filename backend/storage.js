'use strict';

var BSON = require('mongodb').BSONPure;
var clone = require('clone');

var Storage = function(db, collection) {
  this.db = db;
  this.collection = collection;
};

Storage.prototype.save = function(doc, callback) {
  if (!doc._id) {
    doc._id = new BSON.ObjectID();
  }
  this.db.collection(this.collection).save(doc, {safe: true}, function(err, resp) {
    callback(err, err ? null : doc);
  });
  return this;
};

Storage.prototype.findAll = function(query, callback) {
  var cursor = this.db.collection(this.collection).find(query, {});
  if (callback) {
    return cursor.toArray(callback);
  }
  return cursor;
};

Storage.prototype.findById = function(id, callback) {
  this.db.collection(this.collection).findOne({'_id': new BSON.ObjectID(id)}, callback);
};

Storage.prototype.update = function(doc, callback) {
  var data = clone(doc);
  var id = doc._id;
  delete data._id;
  var cb = function(err, resp) {
    data._id = id;
    callback(err, data);
  };
  this.db.collection(this.collection).update(
    {'_id': new BSON.ObjectID(id + '')},
    data,
    {safe: true},
    cb
  );
};

Storage.prototype.remove = function(id, callback) {
  this.db.collection(this.collection).removeById(
    new BSON.ObjectID(id),
    {safe: true},
    callback
  );
};

module.exports = Storage;
