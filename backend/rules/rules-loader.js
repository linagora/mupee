'use strict';

var fs = require('fs'),
    Path = require('path');
var RuleAction = require('./rule-action'),
    RuleCondition = require('./rule-condition');

function hasJavascriptExtension(filename) {
  var dotJs = '.js'
  return filename.indexOf(dotJs, filename.length - dotJs.length) !== -1;
}

var loadModules = exports.loadModules = function(pathRelSource, pathRelExecution, type, callback) {
  fs.readdir(pathRelExecution, function(err, files) {
    if (err) {
      callback(err, null);
    } else {
      var modules = {};
      files.forEach(function(file) {
        if (hasJavascriptExtension(file)) {
          var path = './' + Path.join(pathRelSource, file);
          try {
            var module = require(path);
            if (module instanceof type && module.id)
            modules[module.id] = module;
          } catch (err) {
            callback(err, null);
          }
        }
      });
      callback(null, modules);
    }
  });
};

exports.loadActions = function(callback) {
  loadModules('./actions', './backend/rules/actions/', RuleAction, callback);
}

exports.loadConditions = function(callback) {
  loadModules('./conditions', './backend/rules/conditions/', RuleCondition, callback);
}
