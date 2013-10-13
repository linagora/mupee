'use strict';

var fs = require('fs'),
    Path = require('path');
var RuleAction = require('./rule-action'),
    RuleCondition = require('./rule-condition');

function hasJavascriptExtension(filename) {
  var dotJs = '.js'
  return filename.indexOf(dotJs, filename.length - dotJs.length) !== -1;
}

var loadModules = exports.loadModules = function(pathRelSource, pathRelExecution, type) {
  var files = fs.readdirSync(pathRelExecution);
  var modules = {};
  files
  .filter(hasJavascriptExtension)
  .map(function(file) {
    return('./' + Path.join(pathRelSource, file));
  })
  .forEach(function(path) {
    var module = require(path);
    if (module instanceof type && module.id)
      modules[module.id] = module;
  });
  return modules;
};

var loadActions = exports.loadActions = function() {
  return loadModules('./actions', './backend/rules/actions/', RuleAction);
};

var loadConditions = exports.loadConditions = function() {
  return loadModules('./conditions', './backend/rules/conditions/', RuleCondition);
};

exports.actions = loadActions();
exports.conditions = loadConditions();
