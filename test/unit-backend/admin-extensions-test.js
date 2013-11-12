'use strict';

var db = require('../../backend/mongo-provider'),
    fixtures,
    ExtensionStorage,
    versions,
    mockery = require('mockery'),
    testLogger = require('./test-logger');

require('chai').should();

describe('The admin/extensions/findAll route', function() {
  var storage;

  beforeEach(function() {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    mockery.registerMock('../../logger', testLogger);
    fixtures = require('./extension-fixtures');
    ExtensionStorage = require('../../backend/extension-storage');
    versions = require('../../backend/routes/admin/extensions');
    storage = new ExtensionStorage(db);
  });

  it('should send 400 if an unsupported query param is sent', function(done) {
    versions.findAll({
      query: {
        unsupported: 'parameter'
      }
    }, {
      send: function(data) {
        data.should.equal(400);
        done();
      }
    });
  });

  it('should send 400 if an unsupported product is used as a filter', function(done) {
    versions.findAll({
      query: {
        product: 'SeaMonkey'
      }
    }, {
      send: function(data) {
        data.should.equal(400);
        done();
      }
    });
  });

  it('should return no extensions if therer\'s no extensions in database', function(done) {
    versions.findAll({}, {
      send: function(data) {
        data.should.deep.equal([]);
        done();
      }
    });
  });

  it('should return all extensions if no query filter is used', function(done) {
    storage.save(fixtures.ltn122Linux(), function() {
      storage.save(fixtures.obmConnector32011(), function() {
        versions.findAll({
          query: {}
        }, {
          send: function(data) {
            data.length.should.equal(2);
            done();
          }
        });
      });
    });
  });

  it('should return only matching extensions if only product is used as a filter', function(done) {
    storage.save(fixtures.frDict45(), function() {
      storage.save(fixtures.obmConnector32011(), function() {
        versions.findAll({
          query: {
            product: 'Firefox'
          }
        }, {
          send: function(data) {
            data.length.should.equal(1);
            data[0].id.should.equal('fr-dicollecte@dictionaries.addons.mozilla.org');
            done();
          }
        });
      });
    });
  });

  it('should return no extensions if product and branch are used as filters and nothing matches', function(done) {
    storage.save(fixtures.ltn122LinuxBinaryComp(), function() {
      storage.save(fixtures.obmConnector32011Strict(), function() {
        versions.findAll({
          query: {
            product: 'Thunderbird',
            branch: '24'
          }
        }, {
          send: function(data) {
            data.should.deep.equal([]);
            done();
          }
        });
      });
    });
  });

  it('should return matching extensions if product and branch are used as filters', function(done) {
    storage.save(fixtures.ltn122LinuxBinaryComp(), function() {
      storage.save(fixtures.obmConnector32011(), function() {
        versions.findAll({
          query: {
            product: 'Thunderbird',
            branch: '17'
          }
        }, {
          send: function(data) {
            data.length.should.equal(1);
            data[0].id.should.equal('obm-connector@aliasource.fr');
            done();
          }
        });
      });
    });
  });

  it('should honor strictCompatibility flag', function(done) {
    storage.save(fixtures.obmConnector32011Strict(), function() {
      versions.findAll({
        query: {
          product: 'Thunderbird',
          branch: '24'
        }
      }, {
        send: function(data) {
          data.should.deep.equal([]);
          done();
        }
      });
    });
  });

  it('should honor hasBinaryComponent flag', function(done) {
    storage.save(fixtures.ltn122LinuxBinaryComp(), function() {
      versions.findAll({
        query: {
          product: 'Thunderbird',
          branch: '24'
        }
      }, {
        send: function(data) {
          data.should.deep.equal([]);
          done();
        }
      });
    });
  });

  it('should do strict version checking for products with version < 10', function(done) {
    storage.save(fixtures.ltn10b2Linux(), function() {
      versions.findAll({
        query: {
          product: 'Thunderbird',
          branch: '5'
        }
      }, {
        send: function(data) {
          data.should.deep.equal([]);
          done();
        }
      });
    });
  });

  it('should do strict version checking if extension has a binary component and doesn\'t set strict mode', function(done) {
    storage.save(fixtures.ltn122LinuxBinaryCompNoStrict(), function() {
      versions.findAll({
        query: {
          product: 'Thunderbird',
          branch: '11'
        }
      }, {
        send: function(data) {
          data.should.deep.equal([]);
          done();
        }
      });
    });
  });

  it('should do relaxed version checking for products with version >= 10', function(done) {
    storage.save(fixtures.obmConnector32011(), function() {
      versions.findAll({
        query: {
          product: 'Thunderbird',
          branch: '24'
        }
      }, {
        send: function(data) {
          data.length.should.equal(1);
          data[0].id.should.equal('obm-connector@aliasource.fr');
          done();
        }
      });
    });
  });

  afterEach(function() {
    db.collection('extensions').drop();
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

});

