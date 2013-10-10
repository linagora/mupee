'use strict';
var chai = require("chai");
var expect = chai.expect;
var mockery = require("mockery");
var DbProvider = require('../../backend/mongo-provider');
var SourceVersion = require('../../backend/source-version');
var events = require('events');
var util = require('util');
var testLogger = require('./test-logger');
var musScraper;
function MetadataStorage() {};

MetadataStorage.prototype.findByVersion = function(thing, callback) {};
MetadataStorage.prototype.save = function(thing, callback) {};

function Downloader () {
  events.EventEmitter.call(this);
};
util.inherits(Downloader, events.EventEmitter);
Downloader.prototype.downloadAll = function(tasks) {};


function UpdateFetcher() {};
UpdateFetcher.fetch = function(version, callback) {};

describe("The mozilla Updates Server Sraper module", function() {
  var id;
  var db = DbProvider.db();
  var version = new SourceVersion(
    {
      product: "Thunderbird",
      version: "10.0.12",
      buildId: "20130105062021",
      buildTarget: "Linux_x86-gcc3",
      locale: "fr",
      channel: "esr",
      osVersion: "Linux 3.5.0-40-generic (GTK 2.24.13)",
      branch: "10",
      parameters: {
        force: "1"
      }
    }
  );

  var withUpdate =
    {
      product: "Thunderbird",
      version: "10.0.12",
      buildId: "20130105062021",
      buildTarget: "Linux_x86-gcc3",
      locale: "fr",
      channel: "esr",
      osVersion: "Linux 3.5.0-40-generic (GTK 2.24.13)",
      branch: "10",
      parameters: {
        force: "1"
      },
      updates: [
        {
          "type" : "minor",
          "version" : null,
          "extensionVersion" : null,
          "displayVersion" : "17.0.9esr",
          "appVersion" : "17.0.9",
          "platformVersion" : "17.0.9",
          "buildId" : "20130911173805",
          "detailsUrl" : "http://live.mozillamessaging.com/thunderbird/releasenotes?locale=fr&platform",
          "patches" : [
            {
              "type" : "complete",
              "url" : "http://download.mozilla.org/?product=thunderbird-17.0.9esr-complete",
              "localPath" : "Thunderbird/17.0.9/20130911173805/Linux_x86-gcc3/fr/binary",
              "hashFunction" : "SHA512",
              "hashValue" : "232f4210745e0aee2a7df49de601ce69368088d1383ad3c5746c6b5faeaad",
              "size" : "21580592"
            }
          ]
        }
      ]
    };

    var withUpdate2 =
    {
      product: "Thunderbird",
      version: "10.0.12",
      buildId: "20130105062021",
      buildTarget: "Linux_x86-gcc3",
      locale: "fr",
      channel: "esr",
      osVersion: "Linux 3.5.0-40-generic (GTK 2.24.13)",
      branch: "10",
      parameters: {
        force: "1"
      },
      updates: [
        {
          "type" : "minor",
          "version" : null,
          "extensionVersion" : null,
          "displayVersion" : "17.0.10esr",
          "appVersion" : "17.0.10",
          "platformVersion" : "17.0.10",
          "buildId" : "20131011173805",
          "detailsUrl" : "http://live.mozillamessaging.com/thunderbird/releasenotes?locale=fr&platform",
          "patches" : [
            {
              "type" : "complete",
              "url" : "http://download.mozilla.org/?product=thunderbird-17.0.10esr-complete",
              "localPath" : "Thunderbird/17.0.10/20131011173805/Linux_x86-gcc3/fr/binary",
              "hashFunction" : "SHA512",
              "hashValue" : "232f4210745e0aee2a",
              "size" : "21580590"
            }
          ]
         }
      ]
    };

  before(function() {
    mockery.enable({warnOnUnregistered: false});
    mockery.registerMock('./update-storage', MetadataStorage);
    mockery.registerMock('./downloader', Downloader);
    mockery.registerMock('./update-fetcher', UpdateFetcher);
    mockery.registerMock('./logger', testLogger);
    musScraper = require("../../backend/mozilla-updates-server-scraper");
  });

  beforeEach(function(done) {
    db.collection('source-versions').save(version, {safe: true}, function(err, result) {
      id = result._id;
      done();
    });
  });

  describe("when receiving a clientVersion", function() {
    it("should find that version in the database and query the mozilla servers", function(done) {
      var count = 0;
      var versionWithUpdate = new SourceVersion(withUpdate);
      UpdateFetcher.fetch = function(version, callback) {
        process.nextTick(function() {
          count++;
          callback(null, versionWithUpdate);
        });
      };

      MetadataStorage.prototype.findByVersion = function(version, callback) {
        process.nextTick(function() {
          count++;
          callback(null, versionWithUpdate);
        });
      };

      musScraper(version, function() {
        expect(count).to.equal(2);
        done();
      });
    });
  });

  describe("when receiving a clientVersion having an update in base", function() {
    describe("when the mozilla servers sends the same upgrade", function() {
      it("shouldn't start a download", function(done) {
        var count = 0;
        var downloadStarted = 0;
        var dbVersion = new SourceVersion(withUpdate);
        var musVersion = new SourceVersion(withUpdate);
        UpdateFetcher.fetch = function(version, callback) {
          process.nextTick(function() {
            count++;
            callback(null, musVersion);
          });
        };

        MetadataStorage.prototype.findByVersion = function(version, callback) {
          process.nextTick(function() {
            count++;
            callback(null, dbVersion);
          });
        };

        Downloader.prototype.downloadAll = function(tasks) {
          downloadStarted++;
        };

        musScraper(version, function() {
          expect(count).to.equal(2);
          expect(downloadStarted).to.equal(0);
          done();
        });
      });
    });

    describe("when the mozilla servers sends a new upgrade", function() {
      it("should start a download, and record the sourceVersion with two upgrades", function(done) {
        var count = 0;
        var downloadStarted = 0;
        var dbVersion = new SourceVersion(withUpdate);
        var musVersion = new SourceVersion(withUpdate2);
        var saved = null;
        UpdateFetcher.fetch = function(version, callback) {
          process.nextTick(function() {
            count++;
            callback(null, musVersion);
          });
        };

        MetadataStorage.prototype.findByVersion = function(version, callback) {
          process.nextTick(function() {
            count++;
            callback(null, dbVersion);
          });
        };

        MetadataStorage.prototype.save = function(version, callback) {
          saved = version;
          callback(null, version);
        };

        Downloader.prototype.downloadAll = function(tasks) {
          downloadStarted++;
          var self = this;
          function consumeTasks() {
            if ( tasks.length ) {
              process.nextTick(function() {
                var t = tasks.shift();
                self.emit("finish-task",null, t);
                consumeTasks();
              });
            } else {
              self.emit("finish",null);
            }
          };
          consumeTasks();
        };

        musScraper(version, function() {
          expect(count).to.equal(2);
          expect(downloadStarted).to.equal(1);
          expect(saved).not.to.be.null;
          expect(saved.updates[0].displayVersion).to.equal("17.0.9esr");
          expect(saved.updates[1].displayVersion).to.equal("17.0.10esr");
          expect(saved.updates[0].patches[0].url).to.equal("http://download.mozilla.org/?product=thunderbird-17.0.9esr-complete");
          expect(saved.updates[1].patches[0].url).to.equal("http://download.mozilla.org/?product=thunderbird-17.0.10esr-complete");
          done();
        });
      });
    });
  });

  after(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });
});
