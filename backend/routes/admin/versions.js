'use strict';

var db = require('../../mongo-provider'),
    UpdateStorage = require('../../update-storage');

var storage = new UpdateStorage(db);

exports.findAll = function(request, response) {
  var query = request.query;
  storage.findAll(query || {}, function(error, updates) {
    response.send(updates);
  });
};

exports.findOne = function(request, response) {
  var id = request.params.id;
  storage.findById(id, function(error, updates) {
    if (error) {
      return response.send(500, error);
    }
    return response.send(updates || 404);
  });
};
