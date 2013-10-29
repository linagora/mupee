'use strict';

var Update = require('../../backend/mozilla-update').MozillaUpdate;
var fixtures = require('./fixtures/mozilla-update');
var expect = require('chai').expect;
require('chai').should();


describe('The Mozilla Update module', function() {

  it('should generate a well formed xml from Update', function() {
    var expectedXML = fixtures.xml.validTwoPatches();

    var update = new Update({
      type: 'minor',
      version: '3.5.3',
      extensionVersion: '3.5.3',
      buildID: '20090824101458',
      detailsURL: 'http://www.mozilla.com/en-US/firefox/3.5.3/releasenotes/',
      patches: [
        {
          type: 'complete',
          URL: 'http://download.mozilla.org/?product=firefox-3.5.3-complete&os=win&lang=en-US',
          hashFunction: 'SHA512',
          hashValue: 'f8abbaea98bd453b651c24025dbb8cea5908e532ca64ad7150e88778ccb77c0325341c0fecbec3' +
          '7f31f31cdf7e13955c28140725282d2ce7c4a37c89a25319a1',
          size: '10728423'
        },
        {
          type: 'partial',
          URL: 'http://download.mozilla.org/?product=firefox-3.5.3-partial-3.5.2&os=win&lang=en-US',
          hashFunction: 'SHA512',
          hashValue: '20b133f1bd2025360bda8ef0c53132a5806dbd0606e0' +
          'fe7c6d1291d1392532cc960262f87b0c7d4fbe8f9bc9fba64ed28ecd89b664c17f51f98acdd76b26ea6a',
          size: '2531877'
        }
      ]
    });
    update.asXML().should.equal(expectedXML);
  });

  it('should generate no patch tag when no patch is available', function() {
    var expectedXML = fixtures.xml.validNoPatch();

    var update = new Update({
      type: 'minor',
      version: '3.5.3',
      extensionVersion: '3.5.3',
      buildID: '20090824101458',
      detailsURL: 'http://www.mozilla.com/en-US/firefox/3.5.3/releasenotes/'
    });

    update.asXML().should.equal(expectedXML);
  });

  it('should generate app/platform/display versions when defined', function() {
    var expectedXml = fixtures.xml.validAlternativeDataStructure();

    var update = new Update({
      type: 'minor',
      appVersion: 'a3.5.3',
      displayVersion: 'd3.5.3',
      platformVersion: 'p3.5.3',
      buildID: '20090824101458',
      detailsURL: 'http://www.mozilla.com/en-US/firefox/3.5.3/releasenotes/'
    });

    update.asXML().should.equal(expectedXml);
  });

  it('should throw an exception when mandatory Update properties are missing', function() {
    function test() {
      new Update({
        type: 'minor',
        appVersion: 'a3.5.3',
        buildID: '20090824101458',
        detailsURL: 'http://www.mozilla.com/en-US/firefox/3.5.3/releasenotes/'
      });
    }
    expect(test).to.throw(Error);
  });

  it('should throw an exception when mandatory Patch properties are missing', function() {
    function test() {
      new Update({
        type: 'minor',
        version: '3.5.3',
        extensionVersion: '3.5.3',
        buildID: '20090824101458',
        detailsURL: 'http://www.mozilla.com/en-US/firefox/3.5.3/releasenotes/',
        patches: [
          {
            type: 'complete',
            url: 'http://download.mozilla.org/?product=firefox-3.5.3-complete&os=win&lang=en-US',
            hashFunction: 'SHA512',
            size: '10728423'
          }
        ]
      });
    }
    expect(test).to.throw(Error);
  });

  it('should replace undefined properties to null properties', function() {
    var update = new Update({
      type: 'minor',
      extensionVersion: undefined,
      appVersion: 'a3.5.3',
      displayVersion: 'd3.5.3',
      platformVersion: 'p3.5.3',
      buildID: '20090824101458',
      detailsURL: 'http://www.mozilla.com/en-US/firefox/3.5.3/releasenotes/'
    });

    expect(update.version).to.be.null;
    expect(update.extensionVersion).to.be.null;
  });


  describe('The clearPatches() method', function() {
    it('should empty the patches list ', function() {

      var update = new Update({
        type: 'minor',
        version: '3.5.3',
        extensionVersion: '3.5.3',
        buildID: '20090824101458',
        detailsURL: 'http://www.mozilla.com/en-US/firefox/3.5.3/releasenotes/',
        patches: [
          {
            type: 'complete',
            URL: 'http://download.mozilla.org/?product=firefox-3.5.3-complete&os=win&lang=en-US',
            hashFunction: 'SHA512',
            hashValue: 'f8abbaea98bd453b651c24025dbb8cea5908e532ca64ad7150e88778ccb77c0325341c0fecbec3' +
            '7f31f31cdf7e13955c28140725282d2ce7c4a37c89a25319a1',
            size: '10728423'
          },
          {
            type: 'partial',
            URL: 'http://download.mozilla.org/?product=firefox-3.5.3-partial-3.5.2&os=win&lang=en-US',
            hashFunction: 'SHA512',
            hashValue: '20b133f1bd2025360bda8ef0c53132a5806dbd0606e0' +
            'fe7c6d1291d1392532cc960262f87b0c7d4fbe8f9bc9fba64ed28ecd89b664c17f51f98acdd76b26ea6a',
            size: '2531877'
          }
        ]
      });

      update.clearPatches();
      update.patches.should.have.length(0);
    });
  });
});
