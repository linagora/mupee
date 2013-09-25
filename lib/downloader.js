'use strict';

var http = require('http'),
    fs = require('fs'),
    events = require('events'),
    util = require('util'),
    request = require('request');

var Downloader = function() {
  events.EventEmitter.call(this);
};

util.inherits(Downloader, events.EventEmitter);

Downloader.prototype.download = function(url, destination) {
  var self = this;
  var file = fs.createWriteStream(destination);

  request.get(url, function(err, response, body) {
    if (response.statusCode != 200) {
      self.emit('error', http.STATUS_CODES[response.statusCode], err);
    }
  }).pipe(file);

  file.on('finish', function() {
    self.emit('finish');
  }).on('error', function(err) {
    self.emit('error', err);
  });
};

module.exports = Downloader;
