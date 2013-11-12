'use strict';

var expect = require('chai').expect;

var parse,
    mockery = require('mockery'),
    fs = require('fs');

describe('The chrome.manifest parser', function() {

  function load(file) {
    return fs.readFileSync(__dirname + '/resources/' + file, { encoding: 'utf-8' });
  }

  before(function() {
    mockery.enable({warnOnUnregistered: false, useCleanCache: true});

    parse = require('../../backend/chrome-manifest-parser');
  });

  it('should fail if given an undefined stream', function(done) {
    parse(undefined, function(err) {
      expect(err).to.exist;
      done();
    });
  });

  it('should fail if given a null stream', function(done) {
    parse(null, function(err) {
      expect(err).to.exist;
      done();
    });
  });

  it('should fail if given an empty stream', function(done) {
    parse('', function(err) {
      expect(err).to.exist;
      done();
    });
  });

  it('should fail if given an invalid chrome.manifest (manifest instruction without a path)', function(done) {
    parse(load('obm-connector-3.2.0.9-invalid-chrome.manifest'), function(err) {
      expect(err).to.exist;
      done();
    });
  });

  it('should fail if given an invalid chrome.manifest (binary-component instruction without a path)', function(done) {
    parse(load('lightning-1.9-components-invalid-chrome.manifest'), function(err) {
      expect(err).to.exist;
      done();
    });
  });

  it('should parse a valid chrome.manifest (obm-connector 3.2.0.9)', function(done) {
    parse(load('obm-connector-3.2.0.9-chrome.manifest'), function(err, manifest) {
      expect(err).to.not.exist;
      expect(manifest).to.deep.equal({
        instructions: [
          {
            name: 'manifest',
            flags: [],
            path: 'components/obmcomponents.manifest'
          }, {
            name: 'manifest',
            flags: [],
            path: 'components/interfaces.manifest'
          }
        ]
      });
      done();
    });
  });

  it('should parse a valid chrome.manifest (obm-connector 3.2.0.11)', function(done) {
    parse(load('obm-connector-3.2.0.11-chrome.manifest'), function(err, manifest) {
      expect(err).to.not.exist;
      expect(manifest).to.deep.equal({
        instructions: []
      });
      done();
    });
  });

  it('should parse a valid chrome.manifest (lightning 1.9 components.manifest)', function(done) {
    parse(load('lightning-1.9-components-chrome.manifest'), function(err, manifest) {
      expect(err).to.not.exist;
      expect(manifest).to.deep.equal({
        instructions: [
          {
            name: 'binary-component',
            flags: [],
            path: 'calbasecomps.dll'
          }
        ]
      });
      done();
    });
  });

  it('should parse a valid chrome.manifest (lightning 1.9 components.manifest with flags)', function(done) {
    parse(load('lightning-1.9-components-withflags-chrome.manifest'), function(err, manifest) {
      expect(err).to.not.exist;
      expect(manifest).to.deep.equal({
        instructions: [
          {
            name: 'binary-component',
            flags: [
              'appversion>=17.0',
              'os=Darwin',
              'osversion<=10.5'
            ],
            path: 'calbasecomps.dll'
          }
        ]
      });
      done();
    });
  });

  after(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

});
