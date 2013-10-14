'use strict';

var should = require('chai').should(),
    mongo = require('mongoskin'),
    request = require('request'),
    nock = require('nock'),
    mockery = require('mockery'),
    testconfig = require('./test-config');

describe('The Updates route', function() {
    var proxy;
    var emptyReply = '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<updates></updates>';
    var db;
    var scrap = function(clientVersion, callback) {
      callback(null, clientVersion);
    };
    before(function() {
        mockery.enable({warnOnUnregistered: false});
        mockery.registerMock('../mozilla-updates-server-scraper', scrap);
        nock.disableNetConnect();
        proxy = require('../../backend/routes/updates'),
        db = mongo.db('localhost:27017/mozilla-updater?auto_reconnect', {safe: true});
    });
    
    describe("when defined with version and extensionVersion", function(done) {
      it("should store the client version, and respond with an empty update", function(done) {
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
          url: '/update/3/Firefox/3.5.2/20090729225027/WINNT_x86-msvc/en-US/release/Windows_NT%206.0/default/default/update.xml'
        }, {
          send: function (data) {
            data.should.equal(emptyReply);
            should.exist(db.collection('source-versions').findOne({product: 'Firefox'}, done));
          }
        });
      });
    });
    describe('when defined with appVersion, platformVersion and displayVersion', function(done) {
            var resource = '/update/3/Thunderbird/12.0.1/20120428123112/WINNT_x86-msvc/fr/release/' +
                           'Windows_NT%205.1.3.0%20(x86)/default/default/update.xml?force=1';
      it("should store the client version, and respond with an empty update", function(done) {
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
          url: '/update/3/Thunderbird/12.0.1/20120428123112/WINNT_x86-msvc/fr/release/Windows_NT%205.1.3.0%20(x86)/default/default/update.xml?force=1'
        }, {
          send: function (data) {
            data.should.equal(emptyReply);
            should.exist(db.collection('source-versions').findOne({product: 'Firefox'}, done));
          }
        });
      });
    });
    
    describe('When URL is not handled', function(done) {
      it('should send empty updates', function(done) {
        var replyXMLFromProxy = '<?xml version="1.0" encoding=\"UTF-8\"?>\n<updates></updates>';

        proxy.emptyUpdates({}, {
          send: function (data) {
            data.should.equal(replyXMLFromProxy);
            done();
          }
        });
      });
    });

    after(function(done) {
        mockery.disable();
        nock.enableNetConnect();
        db.collection('source-versions').drop(function() {
            db.close(done);
        });
    });

});
