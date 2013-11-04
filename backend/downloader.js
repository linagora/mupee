'use strict';

var http = require('http'),
    fs = require('fs'),
    events = require('events'),
    util = require('util'),
    request = require('request'),
    mkdirp = require('mkdirp'),
    logger = require('./logger'),
    Path = require('path');

var Downloader = function() {
  events.EventEmitter.call(this);
};

util.inherits(Downloader, events.EventEmitter);

Downloader.prototype.checkThatFileDoesNotExists = function(destination, callback) {
  fs.stat(destination, callback);
};

Downloader.prototype.download = function(url, destination, parameter) {
  var self = this;
  this.checkThatFileDoesNotExists(destination, function(err) {
    if (err) {
      logger.log('Starting download of ' + url);
      download();
    } else {
      logger.debug('File ' + destination + ' (' + url + ') is already available.');
      self.emit('finish', null, parameter);
    }
  });
  function download() {
    mkdirp(Path.dirname(destination), function(err) {
      if (err) {
        return self.emit('error', err, parameter);
      }

      var req = request.get(url);

      req.on('response', function(response) {
        if (response.statusCode !== 200) {
          self.emit('error', http.STATUS_CODES[response.statusCode], parameter);
        } else {
          req
            .pipe(fs.createWriteStream(destination))
            .on('finish', function() {
                self.emit('finish', null, parameter);
              })
            .on('error', function(err) {
                self.emit('error', err, parameter);
              });
        }
      });
    });
  }
};

Downloader.prototype.downloadAll = function(tasks) {
  var count = 0;
  var errors = [];
  var self = this;
  var downloader = new Downloader();
  var cb = function(err, task) {
    count++;

    if (err) {
      errors.push(err);
    }

    self.emit('finish-task', err, task);
    if (count === tasks.length) {
      self.emit('finish', errors.length ? errors : null);
    }
  };
  downloader.on('finish', cb).on('error', cb);

  tasks.forEach(function(task) {
    downloader.download(task.url, task.destination, task);
  });
};

module.exports = Downloader;
