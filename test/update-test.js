'use strict';

var should = require('chai').should(),
    Update = require('../lib/update').Update,
    Patch = require('../lib/update').Patch;

describe('The Update module', function() {

  it('should generate a well formed xml from Update', function() {
    var expectedXML = '<update type="minor" version="3.5.3" extensionVersion="3.5.3" buildID="20090824101458" ' +
                          'detailsURL="http://www.mozilla.com/en-US/firefox/3.5.3/releasenotes/">' +
                        '<patch type="complete" URL="http://download.mozilla.org/?product=firefox-3.5.3-complete' +
                            '&amp;os=win&amp;lang=en-US" hashFunction="SHA512" ' +
                            'hashValue="f8abbaea98bd453b651c24025dbb8cea5908e532ca64ad7150e88778ccb77c0325341c0fecb' +
                            'ec37f31f31cdf7e13955c28140725282d2ce7c4a37c89a25319a1" size="10728423"/>' +
                        '<patch type="partial" URL="http://download.mozilla.org/?' +
                            'product=firefox-3.5.3-partial-3.5.2&amp;os=win&amp;lang=en-US" hashFunction="SHA512" ' +
                            'hashValue="20b133f1bd2025360bda8ef0c53132a5806dbd0606e0fe7c6d1291d1392532cc960262f87b0' +
                            'c7d4fbe8f9bc9fba64ed28ecd89b664c17f51f98acdd76b26ea6a" size="2531877"/>' +
                      '</update>';

    var update = new Update({
      type : 'minor',
      version : '3.5.3',
      extensionVersion : '3.5.3',
      buildId : '20090824101458',
      detailsUrl : 'http://www.mozilla.com/en-US/firefox/3.5.3/releasenotes/',
      patches : [{
          type : 'complete',
          url : 'http://download.mozilla.org/?product=firefox-3.5.3-complete&os=win&lang=en-US',
          hashFunction : 'SHA512',
          hashValue : 'f8abbaea98bd453b651c24025dbb8cea5908e532ca64ad7150e88778ccb77c0325341c0fecbec3' +
          '7f31f31cdf7e13955c28140725282d2ce7c4a37c89a25319a1',
          size : '10728423'
        },{
          type : 'partial',
          url : 'http://download.mozilla.org/?product=firefox-3.5.3-partial-3.5.2&os=win&lang=en-US',
          hashFunction : 'SHA512',
          hashValue : '20b133f1bd2025360bda8ef0c53132a5806dbd0606e0' +
          'fe7c6d1291d1392532cc960262f87b0c7d4fbe8f9bc9fba64ed28ecd89b664c17f51f98acdd76b26ea6a',
          size : '2531877'
        }
      ]
    });
    update.asXML().should.equal(expectedXML);
  });

  it('should generate no patch tag when no patch is available', function() {
    var expectedXML = '<update type="minor" version="3.5.3" extensionVersion="3.5.3" buildID="20090824101458" ' +
                          'detailsURL="http://www.mozilla.com/en-US/firefox/3.5.3/releasenotes/">' +
                      '</update>';

    var update = new Update({
      type : 'minor',
      version : '3.5.3',
      extensionVersion : '3.5.3',
      buildId : '20090824101458',
      detailsUrl : 'http://www.mozilla.com/en-US/firefox/3.5.3/releasenotes/'
    });

    update.asXML().should.equal(expectedXML);
  });
  
  it('should generate app/platform/display versions when defined', function() {
    var expectedXml = '<update type="minor" displayVersion="d3.5.3" appVersion="a3.5.3" platformVersion="p3.5.3" ' + 
                          'buildID="20090824101458" '+
                          'detailsURL="http://www.mozilla.com/en-US/firefox/3.5.3/releasenotes/">' +
                      '</update>';

    var update = new Update({
      type: 'minor',
      appVersion: 'a3.5.3',
      displayVersion: 'd3.5.3',
      platformVersion: 'p3.5.3',
      buildId: '20090824101458',
      detailsUrl: 'http://www.mozilla.com/en-US/firefox/3.5.3/releasenotes/'
    });

    update.asXML().should.equal(expectedXml);
  });
});
