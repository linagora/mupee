'use strict';

var expect = require('chai').expect;

var fs = require('fs'),
    Path = require('path'),
    ExtensionUpdate = require('../../backend/extension-source-version').ExtensionUpdate,
    fixtures = require('./extension-source-version-fixtures');

describe('The ExtensionSourceVersion module', function() {

  it('should fail when creating an ExtensionUpdate with no object', function(done) {
    try {
      new ExtensionUpdate();
    } catch (err) {
      done();
    }
  });

  it('should fail when creating an ExtensionUpdate with a null object', function(done) {
    try {
      new ExtensionUpdate(null);
    } catch (err) {
      done();
    }
  });

  it('should fail when creating an ExtensionUpdate with no version property', function(done) {
    try {
      new ExtensionUpdate({});
    } catch (err) {
      done();
    }
  });

  it('should fail when creating an ExtensionUpdate with no targetApplication property', function(done) {
    try {
      new ExtensionUpdate({ version: '1234' });
    } catch (err) {
      done();
    }
  });

  it('should fail when creating an ExtensionUpdate with a targetApplication with no id', function(done) {
    try {
      new ExtensionUpdate({ version: '1234', targetApplication: {} });
    } catch (err) {
      done();
    }
  });

  it('should fail when creating an ExtensionUpdate with a targetApplication with no minVersion', function(done) {
    try {
      new ExtensionUpdate({ version: '1234', targetApplication: { id: 'id' } });
    } catch (err) {
      done();
    }
  });

  it('should fail when creating an ExtensionUpdate with a targetApplication with no maxVersion', function(done) {
    try {
      new ExtensionUpdate({ version: '1234', targetApplication: { id: 'id', minVersion: '1.0' } });
    } catch (err) {
      done();
    }
  });

  it('should allow creating an ExtensionUpdate object if validation passes', function() {
    new ExtensionUpdate({ version: '1234', targetApplication: { id: 'id', minVersion: '1.0', maxVersion: '1.*' } });
  });

  it('should add an update when addUpdate() is called', function() {
    var version = fixtures.ltn123TB17WithUpdate();

    version.addUpdate(new ExtensionUpdate({
      version: '0.0.0',
      targetApplication: {
        id: 'id',
        minVersion: '1.0',
        maxVersion: '1.*'
      }
    }));

    expect(version.updates.length).to.equal(2);
  });

  it('should generate an RDF with no updates if there\'s no updates', function() {
    var version = fixtures.ltn123TB17();
    var expectedRDF = fs.readFileSync(Path.join(__dirname, '/resources/lightning-noupdates.rdf'), {encoding: 'utf-8'});

    expect(version.updatesAsRDF()).to.equal(expectedRDF);
  });

  it('should generate an RDF with updates if there\'s an update', function() {
    var version = fixtures.ltn123TB17WithUpdate();
    var expectedRDF = fs.readFileSync(Path.join(__dirname, '/resources/lightning-1.9.1.rdf'), {encoding: 'utf-8'});

    expect(version.updatesAsRDF()).to.equal(expectedRDF);
  });

});
