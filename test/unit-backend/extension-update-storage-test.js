'use strict';

var chai = require('chai'),
    expect = chai.expect;

var db = require('../../backend/mongo-provider'),
    ExtensionUpdateStorage = require('../../backend/extension-update-storage'),
    ExtensionUpdate = require('../../backend/extension-source-version').ExtensionUpdate,
    fixtures = require('./extension-source-version-fixtures');

describe('The ExtensionUpdateStorage module', function() {

  var id;
  var manager = new ExtensionUpdateStorage(db);
  var version = fixtures.ltn123TB17WithUpdate();
  var versionQuery = {
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
  };

  beforeEach(function(done) {
    manager.save(version, function(err, result) {
      id = result._id;
      done();
    });
  });

  it('should allow adding a version document to persistent storage', function(done) {
    manager.findById(id.toString(), function(err, record) {
      if (err) {
        throw err;
      }

      expect(record).to.exist;
      expect(record).to.have.property('_id');
      expect(record.updates).to.have.property('length', 1);
      done();
    });
  });

  it('should allow finding updates for a version from persistent storage', function(done) {
    manager.findByVersion(versionQuery, function(err, records) {
      if (err) {
        throw err;
      }

      var record = records[0];

      expect(record).to.exist;
      expect(record).to.have.property('_id');
      expect(record).to.have.property('timestamp');
      done();
    });
  });

  it('should allow replacing a version document in persistent storage', function(done) {
    version.updates.push(new ExtensionUpdate({
      version: '1.9.2',
      targetApplication: {
        id: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
        minVersion: '17.0',
        maxVersion: '17.x',
        updateLink: 'https://addons.cdn.mozilla.net/storage/public-staging/2313/lightning-1.9.1-sm+tb-linux.xpi',
        updateInfoURL: 'https://addons.mozilla.org/versions/updateInfo/1428980/%APP_LOCALE%/',
        updateHash: 'sha256:5f190e99ce21de00a173bf37e0b76904a0306756075e72c779c42cee65cde4c6'
      }
    }));

    manager.save(version, function(err, updated) {
      expect(updated).to.exist;

      manager.findByVersion(versionQuery, function(err, records) {
        if (err) {
          throw err;
        }

        var record = records[0];

        expect(record).to.exist;
        expect(record).to.have.property('updates');
        expect(record.updates).to.have.length(2);
        done();
      });
    });
  });

  afterEach(function(done) {
    db.collection('extension-source-versions').drop(done);
  });

  after(function() {
    db.close();
  });

});
