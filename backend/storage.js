'use strict';

var BSON = require('mongodb').BSONPure;
var clone = require("clone");

var Storage = function(db, collection) {
  this.db = db;
  this.collection = collection;
};

Storage.prototype.save = function(rule, callback) {
  if (!rule._id) {
    rule._id = new BSON.ObjectID();
  }
  this.db.collection(this.collection).save(rule, {safe: true}, function(err,resp) {
    callback(err, err ? null : rule);
  });
  return this;
};

Storage.prototype.findByVersion = function() {};

Storage.prototype.findAll = function(query, callback) {
  this.db.collection(this.collection).find(query, {}).toArray(callback);
};

Storage.prototype.findById = function(id, callback) {
  this.db.collection(this.collection).findOne({'_id': new BSON.ObjectID(id)}, callback);
};

Storage.prototype.update = function(rule, callback) {
  var data = clone(rule);
  var id = rule._id;
  delete data._id;
  var cb = function(err,resp) {
    data._id = id;
    callback(err,data);
  };
  this.db.collection(this.collection).update(
    {'_id': new BSON.ObjectID(id+"")},
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
