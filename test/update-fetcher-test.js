'use strict';

var chai = require('chai');
var nock = require('nock');

var expect = chai.expect;

var UpdateFetcher = require('../lib/update-fetcher'),
    SourceVersion = require('../lib/source-version'),
    fixtures = require('../test/fixtures');

describe('The UpdateFetcher module', function() {

  before(function() {
    nock.disableNetConnect();
  });

  it('should update the metadata if there is a new version available', function(done) {
    var mockedMozillaServer = nock('https://aus3.mozilla.org')
      .get('/update/3/Firefox/3.5.2/20090729225027/WINNT_x86-msvc/en-US/release/Windows_NT%206.0/default/default/update.xml')
      .reply(
      200,
      '<?xml version="1.0"?>' +
      '<updates>' +
        '<update type="minor" version="3.6.18" extensionVersion="3.6.18" buildID="20110614230723" detailsURL="https://www.mozilla.com/en-US/firefox/3.6/details/">' +
        '<patch type="complete" URL="http://download.mozilla.org/?product=firefox-3.6.18-complete&amp;os=win&amp;lang=en-US" hashFunction="SHA512" hashValue="345835da0d15607d115cef2a42185f0cdc0d800bde0a0039aac786c370732e2b3855cd0b70a6de390ad49d52f7adfd8df56cd9c69f2b44211ba0bb792d47e59b" size="11587247"/>' +
        '<patch type="partial" URL="http://download.mozilla.org/?product=firefox-3.6.18-complete&amp;os=win&amp;lang=en-US" hashFunction="SHA512" hashValue="345835da0d15607d115cef2a42185f0cdc0d800bde0a0039aac786c370732e2b3855cd0b70a6de390ad49d52f7adfd8df56cd9c69f2b44211ba0bb792d47e59b" size="11587247"/>' +
        '</update>' +
      '</updates>');

    var sourceVersion = new SourceVersion(
      {
        product: 'Firefox',
        version: '3.5.2',
        buildId: '20090729225027',
        buildTarget: 'WINNT_x86-msvc',
        locale: 'en-US',
        channel: 'release',
        osVersion: 'Windows_NT%206.0',
        parameters: {}
      });

    var expectedFetchedVersion = new SourceVersion(
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
            ]
          }
        ]
      });

    UpdateFetcher.fetch(sourceVersion, function(error, fetchedVersion) {
      expect(error).to.equal.null;
      expect(fetchedVersion).to.deep.equal(expectedFetchedVersion);
      done();
    });
  });

  it('should do nothing if there is no new version available', function(done) {

    var mockedMozillaServer = nock('https://aus3.mozilla.org')
      .get('/update/3/Firefox/1.1.1/20090729225027/WINNT_x86-msvc/en-US/release/Windows_NT%206.0/default/default/update.xml')
      .reply(200, '<?xml version="1.0"?><updates></updates>');

    var sourceVersion = new SourceVersion(
      {
        product: 'Firefox',
        version: '1.1.1',
        buildId: '20090729225027',
        buildTarget: 'WINNT_x86-msvc',
        locale: 'en-US',
        channel: 'release',
        osVersion: 'Windows_NT%206.0',
        parameters: {}
      }
    );

    UpdateFetcher.fetch(sourceVersion, function(error, result) {
      expect(error).to.equal(null);
      expect(result).to.deep.equal(sourceVersion);
      done();
    });
  });

  it('should support forced updates', function(done) {

    var sourceVersion = new SourceVersion(
      {
        product: 'Thunderbird',
        version: '12.0.1',
        buildId: '20120428123112',
        buildTarget: 'WINNT_x86-msvc',
        locale: 'fr',
        channel: 'release',
        osVersion: 'Windows_NT%205.1.3.0%20(x86)',
        parameters: {force: '1'}
      });

    var expectedFetchedVersion = new SourceVersion(
      {
        'product' : 'Thunderbird',
        'version' : '12.0.1',
        'buildId' : '20120428123112',
        'buildTarget' : 'WINNT_x86-msvc',
        'locale' : 'fr',
        'channel' : 'release',
        'osVersion' : 'Windows_NT%205.1.3.0%20(x86)',
        'branch' : '12',
        'parameters': {force: '1'},
        'updates' : [
          {
            'type' : 'minor',
            'displayVersion' : '24.0',
            'appVersion' : '24.0',
            'platformVersion' : '24.0',
            'buildId' : '20130911175743',
            'detailsUrl' : 'http://live.mozillamessaging.com/thunderbird/releasenotes?locale=fr&platform=win32&version=24.0',
            'patches' : [
              {
                'type' : 'complete',
                'url' : 'http://download.mozilla.org/?product=thunderbird-24.0-complete&os=win&lang=fr&force=1',
                'hashFunction' : 'SHA512',
                'hashValue' : 'e70cb44daaeca678ebbc41c347ed87973c8e10253e4b72d9373beb2201fc61ac692d937e6b05f3f78062e150d326089cb1b6efb4e246d01758b8a1cb99587d7c',
                'size' : '27118476'
              }
            ]
          }
        ]
      }
    );

    var mockedMozillaServer = nock('https://aus3.mozilla.org')
        .get('/update/3/Thunderbird/12.0.1/20120428123112/WINNT_x86-msvc/fr/release/Windows_NT%205.1.3.0%20(x86)/default/default/update.xml?force=1')
        .once()
        .reply(
        200,
        '<?xml version="1.0"?>' +
        '<updates>' +
          '<update type="minor" displayVersion="24.0" appVersion="24.0" platformVersion="24.0" buildID="20130911175743" detailsURL="http://live.mozillamessaging.com/thunderbird/releasenotes?locale=fr&amp;platform=win32&amp;version=24.0">' + 
            '<patch type="complete" URL="http://download.mozilla.org/?product=thunderbird-24.0-complete&amp;os=win&amp;lang=fr&amp;force=1" hashFunction="SHA512" hashValue="e70cb44daaeca678ebbc41c347ed87973c8e10253e4b72d9373beb2201fc61ac692d937e6b05f3f78062e150d326089cb1b6efb4e246d01758b8a1cb99587d7c" size="27118476"/>' + 
          '</update>' + 
        '</updates>'
    );

    UpdateFetcher.fetch(sourceVersion, function(error, fetchedVersion) {
      expect(error).to.equal.null;
      expect(fetchedVersion).to.deep.equal(expectedFetchedVersion);
      done();
    });
  });

  after(function() {
    nock.enableNetConnect();
  });
});
