'use strict';

var SourceVersion = require('../../backend/source-version'),
    Update = require('../../backend/update').Update,
    Patch = require('../../backend/update').Patch;

exports.withAllFields = function() {
  return new SourceVersion({
    'timestamp': 123456789,
    'product': 'Firefox',
    'version': '3.5.2',
    'buildID': '20090729225027',
    'buildTarget': 'WINNT_x86-msvc',
    'locale': 'en-US',
    'channel': 'release',
    'osVersion': 'Windows_NT%206.0',
    'branch': '3',
    'parameters': {},
    'updates': [
      {
        'type': 'minor',
        'version': '3.6.18',
        'extensionVersion': '3.6.18',
        'displayVersion': null,
        'appVersion': null,
        'platformVersion': null,
        'buildID': '20110614230723',
        'detailsURL': 'https://www.mozilla.com/en-US/firefox/3.6/details/',
        'patches': [
          {
            'type': 'complete',
            'url': 'http://download.mozilla.org/?product=firefox-3.6.18-complete&os=win&lang=en-US',
            'hashFunction': 'SHA512',
            'hashValue': '345835da0d15607d115cef2a42185f0cdc0d800bde0a0039aac786c370732e2b3855cd0b70a6de390ad49d52f7adfd8df56cd9c69f2b44211ba0bb792d47e59b',
            'size': '11587247'
          },
          {
            'type': 'partial',
            'url': 'http://download.mozilla.org/?product=firefox-3.6.18-complete&os=win&lang=en-US',
            'hashFunction': 'SHA512',
            'hashValue': '345835da0d15607d115cef2a42185f0cdc0d800bde0a0039aac786c370732e2b3855cd0b70a6de390ad49d52f7adfd8df56cd9c69f2b44211ba0bb792d47e59b',
            'size': '11587247'
          }
        ],
        'activated': true
      },
      {
        'type': 'major',
        'version': '10.0.2',
        'extensionVersion': '10.0.2',
        'displayVersion': null,
        'appVersion': null,
        'platformVersion': null,
        'buildID': '20110614230724',
        'detailsURL': 'https://www.mozilla.com/en-US/firefox/10.0/details/',
        'patches': [],
        'activated': 'true'
      }
    ]
  });
};

exports.withEmptyUpdates = function() {
  return new SourceVersion({
    timestamp: 123456789,
    product: 'Thunderbird',
    version: '17.0.0',
    buildID: '20090729225028',
    buildTarget: 'WINNT_x86-msvc',
    locale: 'en-US',
    channel: 'release',
    osVersion: 'Windows_NT%206.0',
    parameters: {}
  });
};

exports.updates = {
  thatMatches: function() {
    return new Update({
      'type': 'minor',
      'version': '3.6.18',
      'extensionVersion': '3.6.18',
      'displayVersion': null,
      'appVersion': null,
      'platformVersion': null,
      'buildID': '20110614230723',
      'detailsURL': 'https://www.mozilla.com/en-US/firefox/3.6/details/',
      'patches': [],
      'activated': true
    });
  },
  thatDontMatch: function() {
    return new Update({
      'type': 'minor',
      'version': '3.6.2',
      'extensionVersion': '3.6.2',
      'displayVersion': null,
      'appVersion': null,
      'platformVersion': null,
      'buildID': '20110614230723',
      'detailsURL': 'https://www.mozilla.com/en-US/firefox/3.6/details/',
      'patches': [
      ],
      'activated': true
    });
  }
};

exports.patches = {
  thatMatches: function() {
    return new Patch({
      'type': 'complete',
      'url': 'http://download.mozilla.org/?product=firefox-3.6.18-complete&os=win&lang=en-US',
      'hashFunction': 'SHA512',
      'hashValue': '345835da0d15607d115cef2a42185f0cdc0d800bde0a0039aac786c370732e2b3855cd0b70a6de390ad49d52f7adfd8df56cd9c69f2b44211ba0bb792d47e59b',
      'size': '11587247'
    });
  },
  thatDontMatch: function() {
    return new Patch({
      'type': 'complete',
      'url': 'http://download.mozilla.org/?product=firefox-17.5-complete&os=win&lang=en-US',
      'hashFunction': 'SHA512',
      'hashValue': 'HASH',
      'size': '2'
    });
  }
};

exports.firefox3 = new SourceVersion({
  timestamp: 123456789,
  product: 'Firefox',
  version: '3.5.2',
  buildID: '20090729225027',
  buildTarget: 'WINNT_x86-msvc',
  locale: 'en-US',
  channel: 'release',
  osVersion: 'Windows_NT%206.0',
  branch: '3',
  parameters: {},
  updates: [{
    type: 'minor',
    version: '3.6.18',
    extensionVersion: '3.6.18',
    displayVersion: null,
    appVersion: null,
    platformVersion: null,
    buildID: '20110614230723',
    detailsURL: 'https://www.mozilla.com/en-US/firefox/3.6/details/',
    patches: [{
      type: 'complete',
      url: 'http://download.mozilla.org/?product=firefox-3.6.18-complete&os=win&lang=en-US',
      hashFunction: 'SHA512',
      hashValue: '345835da0d15607d115cef2a42185f0cdc0d800bde0a0039aac786c370732e2b3855cd0b70a6de390ad49d52f7adfd8df56cd9c69f2b44211ba0bb792d47e59b',
      size: '11587247'
    },{
      type: 'partial',
      url: 'http://download.mozilla.org/?product=firefox-3.6.18-complete&os=win&lang=en-US',
      hashFunction: 'SHA512',
      hashValue: '345835da0d15607d115cef2a42185f0cdc0d800bde0a0039aac786c370732e2b3855cd0b70a6de390ad49d52f7adfd8df56cd9c69f2b44211ba0bb792d47e59b',
      size: '11587247'
    }]
  },{
    type: 'major',
    version: '12.0',
    extensionVersion: '3.6.18',
    displayVersion: null,
    appVersion: null,
    platformVersion: null,
    buildID: '20120420145725',
    detailsURL: 'https://www.mozilla.org/en-US/firefox/unsupported/details/',
    patches: [{
      type: 'complete',
      url: 'http://download.mozilla.org/?product=firefox-12.0-complete&os=win&lang=en-US',
      hashFunction: 'SHA512',
      hashValue: 'faaa82ee2342a3e45c5c6edda44fac7670dce9d0f6707f68424bbb328c7ef92cbea64f72bf8bbbd2b04cc028030e7c65b16c8c995e6d56e4307a36d6fae09d83',
      size: '20500773'
    },{
      type: 'partial',
      url: 'http://download.mozilla.org/?product=firefox-12.0-complete&os=win&lang=en-US',
      hashFunction: 'SHA512',
      hashValue: 'faaa82ee2342a3e45c5c6edda44fac7670dce9d0f6707f68424bbb328c7ef92cbea64f72bf8bbbd2b04cc028030e7c65b16c8c995e6d56e4307a36d6fae09d83',
      size: '20500773'
    }]
  },{
    type: 'major',
    version: null,
    extensionVersion: null,
    displayVersion: '24.0',
    appVersion: '24.0',
    platformVersion: '24.0',
    buildID: '20130910160258',
    detailsURL: 'https://www.mozilla.com/en-US/firefox/24.0/releasenotes/',
    actions: 'silent',
    patches: [{
      type: 'complete',
      url: 'http://download.mozilla.org/?product=firefox-24.0-complete&os=win&lang=en-US',
      hashFunction: 'SHA512',
      hashValue: 'bc15a70d540eb52e5050fa9d59fc7f1fa71c1f4c0640442931b9057260e3eb60edd67113510cadb28b2bff47e4385d24634d7f6887e70575ea1c6cf65478cee7',
      size: 28102545
    }]
  }]
});

exports.thunderbird3 = new SourceVersion({
  timestamp: 1382365280974,
  product: 'Thunderbird',
  version: '3.1.20',
  buildID: '20120306133628',
  buildTarget: 'Linux_x86-gcc3',
  locale: 'fr',
  channel: 'release',
  osVersion: 'Linux 3.10-2-amd64 (GTK 2.24.20)',
  branch: '3',
  parameters: {
    force: '1'
  },
  updates: [{
    type: 'major',
    version: '12.0.1',
    extensionVersion: '12.0.1',
    displayVersion: null,
    appVersion: null,
    platformVersion: null,
    buildID: '20120428123100',
    detailsURL: 'https://www.mozilla.org/fr/thunderbird/12.0/details/index.html',
    patches: [{
      type: 'complete',
      url: 'http://download.mozilla.org/?product=thunderbird-12.0.1-complete&os=linux&lang=fr&force=1',
      localPath: 'Thunderbird/12.0.1/20120428123100/Linux_x86-gcc3/fr/binary',
      hashFunction: 'SHA512',
      hashValue: '936c2bf828f116c394a464c95ee7de10a0d41cd4fadf4deec7c644d915aeda96b3cf0df70ed1edda7abe3b173925efe12a95216c80ce2d9bf2e40e3809ea74aa',
      size: 19620770
    },{
      type: 'partial',
      url: 'http://download.mozilla.org/?product=thunderbird-12.0.1-complete&os=linux&lang=fr&force=1',
      localPath: 'Thunderbird/12.0.1/20120428123100/Linux_x86-gcc3/fr/binary',
      hashFunction: 'SHA512',
      hashValue: '936c2bf828f116c394a464c95ee7de10a0d41cd4fadf4deec7c644d915aeda96b3cf0df70ed1edda7abe3b173925efe12a95216c80ce2d9bf2e40e3809ea74aa',
      size: 19620770
    }]
  },{
    type: 'minor',
    version: null,
    extensionVersion: null,
    displayVersion: '24.0.1',
    appVersion: '24.0.1',
    platformVersion: '24.0.1',
    buildID: '20131010053258',
    detailsURL: 'http://live.mozillamessaging.com/thunderbird/releasenotes?locale=fr&platform=linux-i686&version=24.0.1',
    patches: [{
      type: 'complete',
      url: 'http://download.mozilla.org/?product=thunderbird-24.0.1-complete&os=linux&lang=fr&force=1',
      localPath: 'Thunderbird/24.0.1/20131010053258/Linux_x86-gcc3/fr/binary',
      hashFunction: 'SHA512',
      hashValue: 'f9cf0f0c57456b469b394e498f6f4bfa3e96c0a31329380aa391576493951f4d9ee044891a572034e43ebaee1b2b7285d3fe3db1103c59d7e6c021e5d56acc8d',
      size: 29054141
    }]
  }]
});
