'use strict';

var expect = require('chai').expect;

var fs = require('fs'),
    Path = require('path'),
    ExtensionUpdate = require('../../backend/extension-source-version').ExtensionUpdate,
    fixtures = require('./extension-source-version-fixtures');

describe('The ExtensionSourceVersion module', function() {

  it('should add an update when addUpdate() is called', function() {
    var version = fixtures.ltn123TB17WithUpdate();

    version.addUpdate(new ExtensionUpdate({
      version: '0.0.0'
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
