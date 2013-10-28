'use strict';

var chai = require('chai'),
    expect = chai.expect;

var db = require('../../backend/mongo-provider'),
    ExtensionStorage = require('../../backend/extension-storage'),
    fixtures = require('./extension-fixtures');

describe('The ExtensionUpdateStorage module', function() {

  var id;
  var manager = new ExtensionStorage(db);
  var ltn122Linux = fixtures.ltn122Linux();

  beforeEach(function(done) {
    manager.save(ltn122Linux, function(err, result) {
      id = result._id;
      done();
    });
  });

  it('should allow adding an extenstion document to persistent storage', function(done) {
    manager.findById(id.toString(), function(err, record) {
      if (err) {
        throw err;
      }

      expect(record).to.exist;
      expect(record).to.have.property('_id');
      done();
    });
  });

  it('should allow finding an extension in persistent storage, using target platforms as a filter', function(done) {
    manager.findByExtension({
      id: '{e2fda1a4-762b-4020-b5ad-a41df1933103}',
      version: '1.2.2',
      targetPlatforms: ['Linux_x86-gcc3', 'Linux_x86_64-gcc3']
    }, function(err, records) {
      if (err) {
        throw err;
      }

      var record = records[0];

      expect(record).to.exist;
      expect(record).to.have.property('_id');
      done();
    });
  });

  it('should allow finding an extension in persistent storage, without target platforms', function(done) {
    manager.save(fixtures.obmConnector32011(), function(err, result) {
      manager.findByExtension({
        id: 'obm-connector@aliasource.fr',
        version: '3.2.0.11',
        targetPlatforms: []
      }, function(err, records) {
        if (err) {
          throw err;
        }

        var record = records[0];

        expect(record).to.exist;
        expect(record).to.have.property('_id');
        done();
      });
    });
  });

  it('should allow finding an extension in persistent storage, by ID only', function(done) {
    manager.save(fixtures.obmConnector32011(), function(err, result) {
      manager.findByExtension({
        id: 'obm-connector@aliasource.fr'
      }, function(err, records) {
        if (err) {
          throw err;
        }

        var record = records[0];

        expect(record).to.exist;
        expect(record).to.have.property('_id');
        done();
      });
    });
  });

  afterEach(function(done) {
    db.collection('extensions').drop(done);
  });

  after(function() {
    db.close();
  });

});
