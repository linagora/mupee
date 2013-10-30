'use strict';

var SourceVersion = require('../../../backend/source-version');

exports.sources = function() {
  var sv = [];

  for (var i = 10; i < 30; i++) {
    sv.push(new SourceVersion({
      product: 'Thunderbird',
      version: i + '.0.0',
      buildID: '200907292250' + i,
      buildTarget: 'WINNT_x86-msvc',
      locale: 'en-US',
      channel: 'release',
      osVersion: 'Windows_NT%206.0',
      parameters: {}
    }));
  }
  return sv;
};
