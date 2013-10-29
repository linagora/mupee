'use strict';

var productNameToId = {
  'Thunderbird': '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
  'Firefox': '{ec8030f7-c20a-464f-9b0e-13a3a9e97384}'
};
var productIdToName = {
  '{3550f703-e582-4d05-9a08-453d09bdfdc6}': 'Thunderbird',
  '{ec8030f7-c20a-464f-9b0e-13a3a9e97384}': 'Firefox'
};

exports.idFromName = function(name) {
  return productNameToId[name];
};

exports.nameFromId = function(id) {
  return productIdToName[id];
};
