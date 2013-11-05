'use strict';

var should = require('chai').should(),
    nock = require('nock'),
    mockery = require('mockery'),
    testLogger = require('./test-logger'),
    SourceVersion,
    MetadataStorage;

describe('The Updates route', function() {
  var proxy;
  var emptyReply = '<?xml version="1.0" encoding="UTF-8"?>\n<updates></updates>';
  var db;
  var backgroundTasks = {
    addProductScraperTask: function() {}
  };

  before(function() {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
    mockery.registerMock('../background-tasks', backgroundTasks);
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    mockery.registerMock('../../logger', testLogger);
    SourceVersion = require('../../backend/source-version');
    MetadataStorage = require('../../backend/update-storage');
    nock.disableNetConnect();
    proxy = require('../../backend/routes/updates');
    db = require('../../backend/mongo-provider');
  });

  describe('when defined with version and extensionVersion', function() {
    it('should store the client version, and respond with an empty update', function(done) {
      proxy.updateClient({
        params: {
          product: 'Firefox',
          version: '3.5.2',
          build_id: '20090729225027',
          build_target: 'WINNT_x86-msvc',
          locale: 'en-US',
          channel: 'release',
          os_version: 'Windows_NT 6.0'
        },
        query: {},
        ip: 'u.n.i.t',
        URL: '/update/3/Firefox/3.5.2/20090729225027/WINNT_x86-msvc/en-US/release/Windows_NT%206.0/default/default/update.xml'
      }, {
        send: function(data) {
          data.should.equal(emptyReply);
          should.exist(db.collection('source-versions').findOne({product: 'Firefox'}, done));
        }
      });
    });
  });

  describe('when defined with appVersion, platformVersion and displayVersion', function() {
    it('should store the client version, and respond with an empty update', function(done) {
      proxy.updateClient({
        params: {
          product: 'Thunderbird',
          version: '12.0.1',
          build_id: '20120428123112',
          build_target: 'WINNT_x86-msvc',
          locale: 'fr',
          channel: 'release',
          os_version: 'Windows_NT 5.1.3.0 (x86)'
        },
        query: {force: '1'},
        ip: 'u.n.i.t',
        URL: '/update/3/Thunderbird/12.0.1/20120428123112/WINNT_x86-msvc/fr/release/Windows_NT%205.1.3.0%20(x86)/default/default/update.xml?force=1'
      }, {
        send: function(data) {
          data.should.equal(emptyReply);
          should.exist(db.collection('source-versions').findOne({product: 'Thunderbird'}, done));
        }
      });
    });
  });

  describe('When URL is not handled', function() {
    it('should send empty updates', function(done) {
      var replyXMLFromProxy = '<?xml version="1.0" encoding="UTF-8"?>\n<updates></updates>';

      proxy.emptyUpdates({}, {
        send: function(data) {
          data.should.equal(replyXMLFromProxy);
          done();
        }
      });
    });
  });

  describe('should persist the timestamp', function() {
    var realSave, realFindByVersion;
    it('when a client gets a cache-hit', function(done) {
      realSave = MetadataStorage.prototype.save;
      realFindByVersion = MetadataStorage.prototype.findByVersion;
      var cachedDate = Date.now() - 1;
      var cachedVersion = new SourceVersion({
        timestamp: cachedDate,
        product: 'Testing',
        version: '0.0.0',
        buildID: '20120428123112',
        buildTarget: 'WINNT_x86-msvc',
        locale: 'fr',
        channel: 'release',
        osVersion: 'Windows_NT 5.1.3.0 (x86)',
        parameters: {}
      });

      MetadataStorage.prototype.findByVersion = function(clientVersion, callback) {
        if (clientVersion.product !== cachedVersion.product || clientVersion.version !== cachedVersion.version) {
          throw 'Unexpected clientVersion';
        }
        callback(null, cachedVersion);
      };

      MetadataStorage.prototype.save = function(result) {
        result.timestamp.should.not.equal(cachedDate);
        MetadataStorage.prototype.save = realSave;
        MetadataStorage.prototype.findByVersion = realFindByVersion;
        done();
      };

      proxy.updateClient({
        params: {
          product: 'Testing',
          version: '0.0.0',
          build_id: '20120428123112',
          build_target: 'WINNT_x86-msvc',
          locale: 'fr',
          channel: 'release',
          os_version: 'Windows_NT 5.1.3.0 (x86)'
        },
        query: {},
        ip: 'u.n.i.t',
        URL: '/update/3/Thunderbird/12.0.1/20120428123112/WINNT_x86-msvc/fr/release/Windows_NT%205.1.3.0%20(x86)/default/default/update.xml?force=1'
      }, {
        send: function() {}
      });
    });

    it('when a client gets a cache-miss', function(done) {
      var resource = '/update/3/Testing/0.0.0/20120428123112/WINNT_x86-msvc/fr/release/Windows_NT%205.1.3.0%20(x86)/default/default/update.xml';
      var replyXMLFromMoz = '<?xml version="1.0" encoding="UTF-8"?>\n<updates></updates>';
      MetadataStorage.prototype.findByVersion = function(clientVersion, callback) {
        callback();
      };
      MetadataStorage.prototype.save = function(result) {
        result.timestamp.should.not.be.null;
        MetadataStorage.prototype.save = realSave;
        MetadataStorage.prototype.findByVersion = realFindByVersion;
        done();
      };
      nock('https://aus3.mozilla.org')
        .get(resource)
        .once()
        .reply(200, replyXMLFromMoz);

      proxy.updateClient({
        params: {
          product: 'Testing',
          version: '0.0.0',
          build_id: '20120428123112',
          build_target: 'WINNT_x86-msvc',
          locale: 'fr',
          channel: 'release',
          os_version: 'Windows_NT 5.1.3.0 (x86)'
        },
        query: {},
        ip: 'u.n.i.t',
        URL: '/update/3/Thunderbird/12.0.1/20120428123112/WINNT_x86-msvc/fr/release/Windows_NT%205.1.3.0%20(x86)/default/default/update.xml?force=1'
      }, {
        send: function() {}
      });
    });
  });

  afterEach(function(done) {
    db.collection('source-versions').drop(function() {
      db.close(done);
    });
  });

  after(function(done) {
    mockery.deregisterAll();
    mockery.disable();
    mockery.resetCache();
    nock.enableNetConnect();
    done();
  });

});
