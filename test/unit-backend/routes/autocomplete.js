'use strict';

var expect = require('chai').expect,
    nock = require('nock'),
    mockery = require('mockery'),
    testLogger = require('./../test-logger');

describe('The autocomplete route', function() {
  before(function() {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    mockery.registerMock('../../logger', testLogger);
    nock.disableNetConnect();
  });

  afterEach(function(done) {
    mockery.deregisterAll();
    mockery.disable();
    mockery.resetCache();
    nock.enableNetConnect();
    done();
  });

  it('if invalid targetMode is defined should send empty array', function(done) {
    var autocomplete = require('../../../backend/routes/autocomplete');
    var request = {
      query: {}
    };
    var response = {
      send: function(data) {
        expect(data).to.deep.equal([]);
        done();
      }
    };

    autocomplete.getAutoCompleteValues(request, response);
  });

  describe('with empty result from the storage', function() {
    var autocomplete;
    var MockedUpdateStorage = function(db) {};
    MockedUpdateStorage.prototype.findAll = function(query, callback) { callback(); };
    var MockedExtensionStorage = function(db) {};
    MockedExtensionStorage.prototype.findByExtension = function(query, callback) { callback(); };

    before(function() {
      mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
      mockery.registerMock('../../backend/update-storage', MockedUpdateStorage);
      mockery.registerMock('../../backend/extension-storage', MockedExtensionStorage);
      autocomplete = {};
      autocomplete = require('../../../backend/routes/autocomplete');
    });

    after(function(done) {
      mockery.deregisterAll();
      mockery.disable();
      mockery.resetCache();
      nock.enableNetConnect();
      done();
    });

    it('should send empty array for targetMode=product', function(done) {
      var request = {
        query: {
          targetMode: 'product',
          product: 'Thunderbird'
        }
      };
      var response = {
        send: function(data) {
          expect(data).to.deep.equal([]);
          done();
        }
      };

      autocomplete.getAutoCompleteValues(request, response);
    });

    it('should send empty array for targetMode=extension', function(done) {
      var request = {
        query: {
          targetMode: 'extension',
          product: 'Thunderbird'
        }
      };
      var response = {
        send: function(data) {
          expect(data).to.deep.equal([]);
          done();
        }
      };

      autocomplete.getAutoCompleteValues(request, response);
    });
  });

  describe('with result from the storage', function() {
    var autocomplete;
    var resultFromStorage = [
      {
        id: 'id1',
        version: 'version1',
        versionnn: 'fake1',
        branch: 'branch1',
        targetApplications: [
          {
            'id': '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
            'minVersion': '20.0',
            'maxVersion': '25.*',
            'updateLink': null,
            'updateInfoURL': null,
            'updateHash': null
          }
        ]
      }, {
        id: 'id2',
        version: 'version2',
        versionnn: 'fake2',
        branch: 'branch2',
        targetApplications: [
          {
            'id': '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
            'minVersion': '20.0',
            'maxVersion': '25.*',
            'updateLink': null,
            'updateInfoURL': null,
            'updateHash': null
          }
        ]
      }
    ];
    var MockedUpdateStorage = function(db) {};
    MockedUpdateStorage.prototype.findAll = function(query, callback) {
      callback({}, resultFromStorage);
    };
    var MockedExtensionStorage = function(db) {};
    MockedExtensionStorage.prototype.findByExtension = function(query, callback) {
      callback({}, resultFromStorage);
    };

    before(function() {
      mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
      mockery.registerMock('../../backend/update-storage', MockedUpdateStorage);
      mockery.registerMock('../../backend/extension-storage', MockedExtensionStorage);
      autocomplete = {};
      autocomplete = require('../../../backend/routes/autocomplete');
    });

    after(function(done) {
      mockery.deregisterAll();
      mockery.disable();
      mockery.resetCache();
      nock.enableNetConnect();
      done();
    });

    it('should send the correct number of values according to \'property\' for product',
      function(done) {
      var request = {
        query: {
          targetMode: 'product',
          product: 'Thunderbird',
          property: 'version'
        }
      };
      var response = {
        send: function(data) {
          expect(data).to.deep.equal(
            ['version1', 'version2']
          );
          done();
        }
      };

      autocomplete.getAutoCompleteValues(request, response);
    });

    it('should send the correct number of values according to \'property\' for extension',
      function(done) {
      var request = {
        query: {
          targetMode: 'extension',
          product: 'Thunderbird',
          version: '21.0',
          property: 'branch'
        }
      };
      var response = {
        send: function(data) {
          expect(data).to.deep.equal(
            ['branch1', 'branch2']
          );
          done();
        }
      };

      autocomplete.getAutoCompleteValues(request, response);
    });
  });
});
