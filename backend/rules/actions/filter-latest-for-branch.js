'use strict'

function versionsCompare(a, b) {
  var i, cmp, len, re = /(\.0)+[^\.]*$/;

  a = (a + '').replace(re, '').split('.');
  b = (b + '').replace(re, '').split('.');
  len = Math.min(a.length, b.length);
  for (i = 0; i < len; i++) {
    cmp = parseInt(a[i], 10) - parseInt(b[i], 10);
    if (cmp !== 0) {
      return cmp;
    }
  }
  return a.length - b.length;
};

module.exports = function(branch, candidate) {
  var filtered = [];

  candidate.updates.forEach(function(update) {
  var ver = update.version ? update.version : update.displayVersion;

  if (ver.split('.').shift() == branch) {
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
}
