'use strict';

var chai = require('chai'),
    expect = chai.expect;
chai.should();

var db = require('../../backend/mongo-provider'),
    UpdateStorage = require('../../backend/update-storage'),
    SourceVersion = require('../../backend/source-version'),
    Update = require('../../backend/update').Update,
    fixtures = require('./source-version-fixtures');

describe('The UpdateStorage module', function() {
  var manager = new UpdateStorage(db);
  var version = fixtures.withAllFields();
  var versionQuery = new SourceVersion({
    product: 'Firefox',
    version: '3.5.2',
    buildID: '20090729225027',
    buildTarget: 'WINNT_x86-msvc',
    locale: 'en-US',
    channel: 'release',
    osVersion: 'Windows_NT%206.0',
    parameters: {}
  });
  var newUpdate = new Update({
    type: 'major',
    version: 'fake-4.0.0',
    extensionVersion: 'fake-4.0.0',
    buildID: 'FAKEBUILDID',
    detailsUrl: 'https://fake-url.com/'
  });
  var id;

  beforeEach(function(done) {
    manager.save(version, function(err, result) {
      id = result._id;
      done();
    });
  });

  it('should allow adding a version document to persistent storage', function(done) {
    db.collection('source-versions').findOne({ _id: id }, {}, function(err, record) {
      if (err) { throw err; }
      expect(record).to.exist;
      expect(record).to.have.property('_id');
      record.updates.should.have.length(2);
      done();
    });
  });

  it('should allow finding updates for a version from persistent storage', function(done) {
    manager.findByVersion(versionQuery, function(err, record) {
      if (err) { throw err; }
      expect(record).exist;
      expect(record).to.have.property('_id');
      expect(record).to.have.property('channel');
      done();
    });
  });

  it('should allow replacing a version document in persistent storage', function(done) {
    var newVersion = version;
    newVersion.updates.push(newUpdate);
    manager.save(newVersion, function(err, updated) {
      expect(err).to.be.null;
      manager.findByVersion(versionQuery, function(err, updatedRecord) {
        if (err) { throw err; }
        expect(updatedRecord).to.exist;
        expect(updatedRecord).to.have.property('updates');
        expect(updatedRecord.updates).to.have.length(3);
        done();
      });
    });
  });

  afterEach(function(done) {
    db.collection('source-versions').drop(done);
  });

  after(function() {
    db.close();
  });
});
