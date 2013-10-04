'use strict';

var SourceVersion = require('../lib/source-version.js');

exports.withAllFields = function() {
  var sourceVersion = new SourceVersion(
    {
      'product' : 'Firefox',
      'version' : '3.5.2',
      'buildId' : '20090729225027',
      'buildTarget' : 'WINNT_x86-msvc',
      'locale' : 'en-US',
      'channel' : 'release',
      'osVersion' : 'Windows_NT%206.0',
      'branch' : '3',
      'parameters': {},
      'updates' : [
        {
          'type' : 'minor',
          'version' : '3.6.18',
          'extensionVersion' : '3.6.18',
          'displayVersion' : null,
          'appVersion' : null,
          'platformVersion' : null,
          'buildId' : '20110614230723',
          'detailsUrl' : 'https://www.mozilla.com/en-US/firefox/3.6/details/',
          'patches' : [
            {
              'type' : 'complete',
              'url' : 'http://download.mozilla.org/?product=firefox-3.6.18-complete&os=win&lang=en-US',
              'hashFunction' : 'SHA512',
              'hashValue' : '345835da0d15607d115cef2a42185f0cdc0d800bde0a0039aac786c370732e2b3855cd0b70a6de390ad49d52f7adfd8df56cd9c69f2b44211ba0bb792d47e59b',
              'size' : '11587247'
            },
            {
              'type' : 'partial',
              'url' : 'http://download.mozilla.org/?product=firefox-3.6.18-complete&os=win&lang=en-US',
              'hashFunction' : 'SHA512',
              'hashValue' : '345835da0d15607d115cef2a42185f0cdc0d800bde0a0039aac786c370732e2b3855cd0b70a6de390ad49d52f7adfd8df56cd9c69f2b44211ba0bb792d47e59b',
              'size' : '11587247'
            }
          ],
          'activated' : true
        },
        {
          'type' : 'major',
          'version' : '10.0.2',
          'extensionVersion' : '10.0.2',
          'displayVersion' : null,
          'appVersion' : null,
          'platformVersion' : null,
          'buildId' : '20110614230724',
          'detailsUrl' : 'https://www.mozilla.com/en-US/firefox/10.0/details/',
          'patches' : [ ],
          'activated' : 'true'
        }
      ]
    });

  return sourceVersion;
};

exports.withEmptyUpdates = function() {
  var sourceVersion = new SourceVersion(
    {
      product: 'Firefox',
      version: '17.0.0',
      buildId: '20090729225028',
      buildTarget: 'WINNT_x86-msvc',
      locale: 'en-US',
      channel: 'release',
      osVersion: 'Windows_NT%206.0',
      parameters: {}
    }
  );

  return sourceVersion;
};
