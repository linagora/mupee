'use strict';

var ExtensionSourceVersion = require('../../backend/extension-source-version').ExtensionSourceVersion;

exports.ltn123TB17 = function() {
  return new ExtensionSourceVersion({
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
  });
};

exports.ltn123TB17WithUpdate = function() {
  return new ExtensionSourceVersion({
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
    compatMode: 'normal',
    updates: [
      {
        version: '1.9.1',
        targetApplication: {
          id: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
          minVersion: '17.0',
          maxVersion: '17.*',
          updateLink: 'https://addons.cdn.mozilla.net/storage/public-staging/2313/lightning-1.9.1-sm+tb-linux.xpi',
          updateInfoURL: 'https://addons.mozilla.org/versions/updateInfo/1428980/%APP_LOCALE%/',
          updateHash: 'sha256:5f190e99ce21de00a173bf37e0b76904a0306756075e72c779c42cee65cde4c6'
        }
      }
    ]
  });
};

exports.ltn123TB17WithLotOfUpdates = function() {
  return new ExtensionSourceVersion({
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
    compatMode: 'normal',
    updates: [
      {
        version: '1.9.1',
        targetApplication: {
          id: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
          minVersion: '17.0',
          maxVersion: '17.*',
          updateLink: 'https://addons.cdn.mozilla.net/storage/public-staging/2313/lightning-1.9.1-sm+tb-linux.xpi',
          updateInfoURL: 'https://addons.mozilla.org/versions/updateInfo/1428980/%APP_LOCALE%/',
          updateHash: 'sha256:5f190e99ce21de00a173bf37e0b76904a0306756075e72c779c42cee65cde4c6'
        }
      },
      {
        version: '2.0.0',
        targetApplication: {
          id: '{3550f703-e582-4d05-9a08-453d09bdfdc7}',
          minVersion: '17.0',
          maxVersion: '17.*',
          updateLink: 'https://addons.cdn.mozilla.net/storage/public-staging/2313/lightning-1.9.1-sm+tb-linux.xpi',
          updateInfoURL: 'https://addons.mozilla.org/versions/updateInfo/1428980/%APP_LOCALE%/',
          updateHash: 'sha256:5f190e99ce21de00a173bf37e0b76904a0306756075e72c779c42cee65cde4c6'
        }
      },
      {
        version: '2.0.1',
        targetApplication: {
          id: '{3550f703-e582-4d05-9a08-453d09bdfdc8}',
          minVersion: '17.0',
          maxVersion: '17.*',
          updateLink: 'https://addons.cdn.mozilla.net/storage/public-staging/2313/lightning-1.9.1-sm+tb-linux.xpi',
          updateInfoURL: 'https://addons.mozilla.org/versions/updateInfo/1428980/%APP_LOCALE%/',
          updateHash: 'sha256:5f190e99ce21de00a173bf37e0b76904a0306756075e72c779c42cee65cde4c6'
        }
      },
      {
        version: '2.9a.1',
        targetApplication: {
          id: '{3550f703-e582-4d05-9a08-453d09bdfdc9}',
          minVersion: '17.0',
          maxVersion: '17.*',
          updateLink: 'https://addons.cdn.mozilla.net/storage/public-staging/2313/lightning-1.9.1-sm+tb-linux.xpi',
          updateInfoURL: 'https://addons.mozilla.org/versions/updateInfo/1428980/%APP_LOCALE%/',
          updateHash: 'sha256:5f190e99ce21de00a173bf37e0b76904a0306756075e72c779c42cee65cde4c6'
        }
      },
      {
        version: '2.9b.1',
        targetApplication: {
          id: '{3550f703-e582-4d05-9a08-453d09bdfdd0}',
          minVersion: '17.0',
          maxVersion: '17.*',
          updateLink: 'https://addons.cdn.mozilla.net/storage/public-staging/2313/lightning-1.9.1-sm+tb-linux.xpi',
          updateInfoURL: 'https://addons.mozilla.org/versions/updateInfo/1428980/%APP_LOCALE%/',
          updateHash: 'sha256:5f190e99ce21de00a173bf37e0b76904a0306756075e72c779c42cee65cde4c6'
        }
      }
    ]
  });
};
