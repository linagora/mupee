'use strict';

var versionsCompare = require('mozilla-version-comparator');

module.exports = function(branch, candidate) {
  var filtered = [];

  candidate.updates.forEach(function(update) {
    var ver = update.version ? update.version : update.displayVersion;

    if (ver.split('.').shift() <= branch) {
      filtered.push(update);
    }
  });
  candidate.clearUpdates();
  if (filtered.length) {
    filtered.sort(function(left, right) {
      var lver = left.version ? left.version : left.appVersion,
          rver = right.version ? right.version : right.appVersion;
      return - versionsCompare(lver, rver);
    });
    candidate.addUpdate(filtered[0]);
  }
  return candidate;
};
