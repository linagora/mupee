'use strict';

var expect = require('chai').expect;

var SourceVersion = require('../../backend/source-version'),
    fixtures = require('./fixtures');

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

  it("should find an update if that matches the argument", function() {
    var version = fixtures.withAllFields();
    var updateThatMatch = fixtures.updates.thatMatches();
    var result = version.findUpdate(updateThatMatch);
    expect(result).to.exist;
    expect(result.version).to.equal("3.6.18");
  });
  
  it("shouldn't find an update if that doesn't match the argument", function() {
    var version = fixtures.withAllFields();
    var updateThatDontMatch = fixtures.updates.thatDontMatch();
    var result = version.findUpdate(updateThatDontMatch);
    expect(result).to.be.null;
  });
  
  it("should find a patch that if matches the argument", function() {
    var version = fixtures.withAllFields();
    var updateThatMatch = fixtures.updates.thatMatches();
    var patchThatMatch = fixtures.patches.thatMatches();
    var result = version.findPatch(updateThatMatch, patchThatMatch);
    expect(result).to.exist;
    expect(result.hashValue).to.equal("345835da0d15607d115cef2a42185f0cdc0d800bde0a0039aac786c370732e2b3855cd0b70a6de390ad49d52f7adfd8df56cd9c69f2b44211ba0bb792d47e59b");
  });
  
  it("shouldn't find a patch if that doesn't matches the argument", function() {
    var version = fixtures.withAllFields();
    var updateThatMatch = fixtures.updates.thatMatches();
    var patchThatDontMatch = fixtures.patches.thatDontMatch();
    var result = version.findPatch(updateThatMatch, patchThatDontMatch);
    expect(result).to.be.null;
  });
});
