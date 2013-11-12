'use strict';

var SourceVersion = require('../../../backend/source-version'),
    ExtensionSourceVersion = require('../../../backend/extension-source-version').ExtensionSourceVersion;

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

exports.extensions = function() {
  var esv = [];

  for (var i = 10; i < 30; i++) {
    esv.push(new ExtensionSourceVersion({
      reqVersion: 2,
      id: '{e2fda1a4-762b-4020-b5ad-a41df1933103}',
      version: '1.2.3',
      status: 'userEnabled',
      appID: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
      appVersion: '17.0.2',
      appOS: 'Linux',
      appABI: 'x86_64-gcc3',
      currentAppVersion: '17.0.2',
      maxAppVersion: '10.*',
      locale: 'fr',
      updateType: 97,
      compatMode: 'normal'
    }));
  }
  return esv;
};
