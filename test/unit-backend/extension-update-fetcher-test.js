'use strict';

var chai = require('chai'),
    nock = require('nock'),
    expect = chai.expect,
    mockery = require('mockery'),
    testLogger = require('./test-logger');

var url = require('url'),
    Path = require('path'),
    config,
    fetcher,
    fixtures;

function mozUpdateUrl() {
  var parsedUrl = url.parse(config.fetch.extensionsRemoteHost);

  return url.format({
    protocol: parsedUrl.protocol,
    host: parsedUrl.host
  });
}

describe('The ExtensionUpdateFetcher module', function() {

  before(function() {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    mockery.registerMock('../../logger', testLogger);
    nock.disableNetConnect();
    config = require('../../backend/config');
    fetcher = require('../../backend/extension-update-fetcher');
    fixtures = require('./extension-source-version-fixtures');
  });

  it('should update the metadata if there is a new version available', function(done) {
    nock(mozUpdateUrl())
      .get('/update/VersionCheck.php?reqVersion=2&id=%7Be2fda1a4-762b-4020-b5ad-a41df1933103%7D&version=1.2.3&status=userEnabled&appID=%7B3550f703-e582-4d05-9a08-453d09bdfdc6%7D&appVersion=17.0.2&appOS=Linux&appABI=x86_64-gcc3&currentAppVersion=17.0.2&maxAppVersion=10.*&locale=fr&updateType=97&compatMode=normal')
      .replyWithFile(200, Path.join(__dirname, 'resources/lightning-1.9.1.rdf'));

    var sourceVersion = fixtures.ltn123TB17();
    var expectedFetchedVersion = fixtures.ltn123TB17WithUpdate();

    fetcher.fetch(sourceVersion, function(error, fetchedVersion) {
      expect(error).to.be.null;

      delete fetchedVersion.timestamp;
      delete expectedFetchedVersion.timestamp;
      expect(fetchedVersion).to.deep.equal(expectedFetchedVersion);
      done();
    });
  });

  it('should do nothing if there\'s no new version available', function(done) {
    nock(mozUpdateUrl())
      .get('/update/VersionCheck.php?reqVersion=2&id=%7Be2fda1a4-762b-4020-b5ad-a41df1933103%7D&version=1.2.3&status=userEnabled&appID=%7B3550f703-e582-4d05-9a08-453d09bdfdc6%7D&appVersion=17.0.2&appOS=Linux&appABI=x86_64-gcc3&currentAppVersion=17.0.2&maxAppVersion=10.*&locale=fr&updateType=97&compatMode=normal')
      .replyWithFile(200, Path.join(__dirname, 'resources/lightning-noupdates.rdf'));

    var sourceVersion = fixtures.ltn123TB17();
    var expectedFetchedVersion = fixtures.ltn123TB17();

    fetcher.fetch(sourceVersion, function(error, fetchedVersion) {
      expect(error).to.be.null;
      expect(fetchedVersion).to.deep.equal(expectedFetchedVersion);
      done();
    });
  });

  it('should do nothing if RDF is empty', function(done) {
    nock(mozUpdateUrl())
      .get('/update/VersionCheck.php?reqVersion=2&id=%7Be2fda1a4-762b-4020-b5ad-a41df1933103%7D&version=1.2.3&status=userEnabled&appID=%7B3550f703-e582-4d05-9a08-453d09bdfdc6%7D&appVersion=17.0.2&appOS=Linux&appABI=x86_64-gcc3&currentAppVersion=17.0.2&maxAppVersion=10.*&locale=fr&updateType=97&compatMode=normal')
      .replyWithFile(200, Path.join(__dirname, 'resources/lightning-emptyrdf.rdf'));

    var sourceVersion = fixtures.ltn123TB17();
    var expectedFetchedVersion = fixtures.ltn123TB17();

    fetcher.fetch(sourceVersion, function(error, fetchedVersion) {
      expect(error).to.be.null;
      expect(fetchedVersion).to.deep.equal(expectedFetchedVersion);
      done();
    });
  });

  after(function() {
    nock.enableNetConnect();
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

});
