'use strict';

var chai = require('chai'),
    expect = chai.expect;

var mockery = require('mockery'),
    testLogger = require('./test-logger'),
    fs = require('fs-extra'),
    updatesFixtures = require('./extension-source-version-fixtures'),
    util = require('util'),
    events = require('events');

describe('The ExtensionUpdatesScraper module', function() {

  before(function() {
    mockery.enable({warnOnUnregistered: false, warnOnReplace: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('./routes/extension-updates', {});
  });

  it('should do nothing if config.download.autoCache is false', function(done) {
    var Downloader = function() {};
    Downloader.prototype.download = function() { throw 'This test should not download anything'; };

    mockery.registerMock('./downloader', Downloader);
    mockery.registerMock('./config', {
      download: {
        autoCache: false
      }
    });

    var scrap = require('../../backend/mozilla-updates-server-extension-scraper');

    scrap(updatesFixtures.ltn123TB17(), function() {
      mockery.deregisterMock('./config');
      done();
    });
  });

  it('should do nothing if fetcher returns an error', function(done) {
    var Downloader = function() {};
    Downloader.prototype.download = function() { throw 'This test should not download anything'; };

    var fetcher = {
      fetch: function(v, callback) {
        callback('TerribleFailure');
      }
    };

    mockery.registerMock('./extension-update-fetcher', fetcher);
    mockery.registerMock('./downloader', Downloader);

    var scrap = require('../../backend/mozilla-updates-server-extension-scraper');

    scrap(updatesFixtures.ltn123TB17(), done);
  });

  it('should do nothing if fetcher finds no updates', function(done) {
    var Downloader = function() {};
    Downloader.prototype.download = function() { throw 'This test should not download anything'; };

    var fetcher = {
      fetch: function(v, callback) {
        callback(null, updatesFixtures.ltn123TB17());
      }
    };

    mockery.registerMock('./extension-update-fetcher', fetcher);
    mockery.registerMock('./downloader', Downloader);

    var scrap = require('../../backend/mozilla-updates-server-extension-scraper');

    scrap(updatesFixtures.ltn123TB17(), done);
  });

  it('should do nothing if downloader returns an error', function(done) {
    var Downloader = function() { events.EventEmitter.call(this); };
    util.inherits(Downloader, events.EventEmitter);
    Downloader.prototype.download = function() { this.emit('error', 'TerribleFailure'); };

    var fetcher = {
      fetch: function(v, callback) {
        callback(null, updatesFixtures.ltn123TB17WithUpdate());
      }
    };

    var proxy = {
      uploadXpi: function() { throw 'This test should not install any extension'; }
    };

    mockery.registerMock('./extension-update-fetcher', fetcher);
    mockery.registerMock('./downloader', Downloader);
    mockery.registerMock('./routes/extension-updates', proxy);

    var scrap = require('../../backend/mozilla-updates-server-extension-scraper');

    scrap(updatesFixtures.ltn123TB17(), done);
  });

  it('should delegate to uploadXpi() to install the extension', function(done) {
    var Downloader = function() { events.EventEmitter.call(this); };
    util.inherits(Downloader, events.EventEmitter);
    Downloader.prototype.download = function() { this.emit('finish'); };

    var fetcher = {
      fetch: function(v, callback) {
        callback(null, updatesFixtures.ltn123TB17WithUpdate());
      }
    };

    var proxy = {
      uploadXpi: function(req, res) {
        expect(req.files.file.name).to.equal('lightning-1.9.1-sm+tb-linux.xpi');
        expect(req.files.file.path).to.equal('/tmp/Extensions/{e2fda1a4-762b-4020-b5ad-a41df1933103}/1.9.1/lightning-1.9.1-sm+tb-linux.xpi');
        expect(req.files.file.size).to.equal(0);

        done();
      }
    };

    mockery.registerMock('./config', {
      download: {
        autoCache: true,
        dir: '/tmp'
      }
    });
    mockery.registerMock('./extension-update-fetcher', fetcher);
    mockery.registerMock('./downloader', Downloader);
    mockery.registerMock('./routes/extension-updates', proxy);

    var scrap = require('../../backend/mozilla-updates-server-extension-scraper');

    fs.createFileSync('/tmp/Extensions/{e2fda1a4-762b-4020-b5ad-a41df1933103}/1.9.1/lightning-1.9.1-sm+tb-linux.xpi');
    scrap(updatesFixtures.ltn123TB17(), function() {});
  });

  afterEach(function(done) {
    mockery.resetCache();
    done();
  });

  after(function(done) {
    fs.unlink('/tmp/Extensions/{e2fda1a4-762b-4020-b5ad-a41df1933103}/1.9.1/lightning-1.9.1-sm+tb-linux.xpi', function() {});

    mockery.deregisterAll();
    mockery.disable();
    done();
  });

});
