'use strict';

module.exports.compareVersions = function(a, b) {
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
}
