'use strict';

var util = require('util'),
  Storage = require('../storage');

var RulesStorage = function(db) {
  this.db = db;
  this.collection = 'rules';
};

util.inherits(RulesStorage, Storage);

RulesStorage.prototype.findByVersion = function(rule, callback) {
  this.db.collection('rules').find(
    rule,
    {},
    function(err, cursor) {
      cursor.toArray(callback);
    });
};

module.exports = RulesStorage;
