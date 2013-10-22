'use strict';

var BSON = require('mongodb').BSONPure;

var Storage = function(db, collection) {
  this.db = db;
  this.collection = collection;
};

Storage.prototype.save = function(rule, callback) {
  this.db.collection(this.collection).save(rule, {safe: true}, callback);
  return this;
};

Storage.prototype.findByVersion = function() {};

Storage.prototype.findAll = function(query, callback) {
  this.db.collection(this.collection).find(query, {}).toArray(callback);
};

Storage.prototype.findById = function(id, callback) {
  this.db.collection(this.collection).findOne({'_id': new BSON.ObjectID(id)}, callback);
};

Storage.prototype.update = function(id, rule, callback) {
  this.db.collection(this.collection).update(
      {'_id': new BSON.ObjectID(id)},
      rule,
      {safe: true},
      callback
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
