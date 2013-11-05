'use strict';

function getBranch(version) {
  return version ? parseInt(version.substring(0, version.indexOf('.'))) : null;
}

exports.getBranch = getBranch;
