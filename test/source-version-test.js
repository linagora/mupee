'use strict';

var expect = require('chai').expect;

var SourceVersion = require('../lib/source-version'),
    fixtures = require('../test/fixtures');

describe('The SourceVersion module', function() {

  it('should compute its current major branch', function() {
    var version = fixtures.withAllFields();
    expect(version.branch).to.equal('3');
  });

  it('should export its updates as a valid XML file when there is no updates', function() {
    var version = fixtures.withEmptyUpdates();
    var expectedXML = '<?xml version="1.0" encoding=\"UTF-8\"?>\n' +
              '<updates>' +
              '</updates>';
    var actualXML = version.updatesAsXML();
    expect(actualXML).to.equal(expectedXML);
  });

  it('should export its updates as a valid XML file when there is some updates', function() {
    var version = new SourceVersion(
      {
        'product' : 'Firefox',
        'version' : '23.0.2',
        'buildId' : '20090729225027',
        'buildTarget' : 'WINNT_x86-msvc',
        'locale' : 'en-US',
        'channel' : 'release',
        'osVersion' : 'Windows_NT%206.0',
        'parameters': {},
        'updates' : [
          {
            'type' : 'minor',
            'version' : '23.0.3',
            'extensionVersion' : '23.0.3',
            'buildId' : '20100824101458',
            'detailsUrl' : 'http://www.mozilla.com/en-US/firefox/23.0.3/releasenotes/'
          },
          {
            'type' : 'major',
            'version' : '24.0.1',
            'extensionVersion' : '24.0.1',
            'buildId' : '20110824101458',
            'detailsUrl' : 'http://www.mozilla.com/en-US/firefox/24.0.1/releasenotes/' 
          }
        ]
      });

    var expectedXML = '<?xml version="1.0" encoding="UTF-8"?>\n' +
              '<updates>' +
              '<update type="minor" version="23.0.3" extensionVersion="23.0.3" ' +
                'buildID="20100824101458" ' +
                'detailsURL="http://www.mozilla.com/en-US/firefox/23.0.3/releasenotes/">' +
              '</update>' +
              '<update type="major" version="24.0.1" extensionVersion="24.0.1" ' +
                'buildID="20110824101458" ' + 
                'detailsURL="http://www.mozilla.com/en-US/firefox/24.0.1/releasenotes/">' +
              '</update>' +
              '</updates>';
    var actualXML = version.updatesAsXML();
    expect(actualXML).to.equal(expectedXML);
  });

});
