'use strict';

var db = require('../../backend/mongo-provider'),
    fixtures = require('./source-version-fixtures'),
    UpdateStorage = require('../../backend/update-storage'),
    SourceVersion = require('../../backend/source-version'),
    versions = require('../../backend/routes/admin/versions');

require('chai').should();

describe('The Admin versions route module', function() {
  var baseUri;
  var id;
  var id2;
  var storage;

  before(function() {
    baseUri = 'http://localhost:1234/admin/versions';
    storage = new UpdateStorage(db);
  });

  beforeEach(function(done) {
    storage.save(fixtures.withAllFields(), function(error, result) {
      if (error) { throw error; }
      id = result._id;
    }).save(fixtures.withEmptyUpdates(), function(error, result) {
      if (error) { throw error; }
      id2 = result._id;
      done();
    });
  });

  it('should return the correct updates by id', function(done) {
    var expectedData = fixtures.withAllFields();

    var request = {params: {id: id.toString()}};

    var response = {
      send: function(body) {
        delete body._id;
        var actualData = new SourceVersion(body);
        actualData.should.deep.equal(expectedData);
        done();
      }
    };

    versions.findOne(request, response);
  });

  it('should return status 404 if updates is not found by id', function(done) {
    var request = {params: {id: '123456789abc'}};

    var response = {
      send: function(body) {
        body.should.equal(404);
        done();
      }
    };

    versions.findOne(request, response);
  });

  it('should get all updates', function(done) {
    var response = {
      send: function(body) {
        body.length.should.equal(2);
        delete body[0]._id;
        delete body[1]._id;
        new SourceVersion(body[0]).should.deep.equal(fixtures.withAllFields());
        new SourceVersion(body[1]).should.deep.equal(fixtures.withEmptyUpdates());
        done();
      }
    };

    versions.findAll({}, response);
  });

  it('should get all updates by product', function(done) {
    var request = {query: {product: 'Firefox'}};

    var response = {
      send: function(body) {
        body.length.should.equal(1);
        delete body[0]._id;
        new SourceVersion(body[0]).should.deep.equal(fixtures.withAllFields());
        done();
      }
    };

    versions.findAll(request, response);
  });

  afterEach(function(done) {
    db.collection('source-versions').drop(done);
  });
});

