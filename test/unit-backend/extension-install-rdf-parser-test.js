'use strict';

var expect = require('chai').expect;

var fs = require('fs'),
    Path = require('path'),
    mockery = require('mockery'),
    testLogger = require('./test-logger'),
    parseRdf,
    fixtures;

describe('The ExtensionInstallRDFParser module', function() {

  before(function() {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    mockery.registerMock('../../logger', testLogger);
    parseRdf = require('../../backend/extension-install-rdf-parser');
    fixtures = require('./extension-fixtures');
  });

  it('should fail if the stream is null', function() {
    parseRdf(null, function(err) {
      expect(err).to.exist;
    });
  });

  it('should fail if the stream is not valid XML', function() {
    parseRdf('I\'m not an XML stream', function(err) {
      expect(err).to.exist;
    });
  });

  it('should fail if the stream is not a valid install.rdf', function() {
    parseRdf('<notAnInstallRdf />', function(err) {
      expect(err).to.exist;
    });
  });

  it('should parse a valid install.rdf stream (lightning-1.2.2/Linux)', function() {
    var rdf = fs.readFileSync(Path.join(__dirname, '/resources/lightning-1.2.2-install.rdf'));
    var lightning122Linux = fixtures.ltn122Linux();

    parseRdf(rdf, function(err, parsed) {
      expect(err).to.be.null;
      expect(parsed).to.deep.equal(lightning122Linux);
    });
  });

  it('should parse a valid install.rdf stream (lightning-1.2.2/Windows)', function() {
    var rdf = fs.readFileSync(Path.join(__dirname, '/resources/lightning-1.2.2-windows-install.rdf'));
    var ltn122Windows = fixtures.ltn122Windows();

    parseRdf(rdf, function(err, parsed) {
      expect(err).to.be.null;
      expect(parsed).to.deep.equal(ltn122Windows);
    });
  });

  it('should parse a valid install.rdf stream (fr-dict-4.5)', function() {
    var rdf = fs.readFileSync(Path.join(__dirname, '/resources/fr-dict-4.5-install.rdf'));
    var frDict45 = fixtures.frDict45();

    parseRdf(rdf, function(err, parsed) {
      expect(err).to.be.null;
      expect(parsed).to.deep.equal(frDict45);
    });
  });

  it('should parse a valid install.rdf stream (obm-connector-3.2.0.11', function() {
    var rdf = fs.readFileSync(Path.join(__dirname, '/resources/obm-connector-3.2.0.11-install.rdf'));
    var obmCon32011 = fixtures.obmConnector32011();

    parseRdf(rdf, function(err, parsed) {
      expect(err).to.be.null;
      expect(parsed).to.deep.equal(obmCon32011);
    });
  });

  it('should fail if install.rdf have no id', function() {
    var rdf = fs.readFileSync(Path.join(__dirname, '/resources/lightning-1.2.2-install-no-id.rdf'));

    parseRdf(rdf, function(err) {
      expect(err).to.exist;
    });
  });

  it('should fail if install.rdf have no version', function() {
    var rdf = fs.readFileSync(Path.join(__dirname, '/resources/lightning-1.2.2-install-no-version.rdf'));

    parseRdf(rdf, function(err) {
      expect(err).to.exist;
    });
  });

  it('should fail if install.rdf have no targetApplications', function() {
    var rdf = fs.readFileSync(Path.join(__dirname, '/resources/lightning-1.2.2-install-no-targetApplication.rdf'));

    parseRdf(rdf, function(err) {
      expect(err).to.exist;
    });
  });

  after(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

});
