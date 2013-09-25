'use strict';

var chai = require('chai');

var expect = chai.expect,
    should = chai.should();

var Downloader = require('../lib/downloader'),
    fs = require('fs'),
    nock = require('nock');

describe('The downloader module', function() {
  var url;
  var destination;
  var testingFilePath;
  var downloader;

  before(function() {
    url = 'http://www.obm.org/gpl.txt';
    destination = '/tmp/gpl.txt';
    testingFilePath = __dirname + '/../test/gpl-for-testing.txt';
  });

  beforeEach(function() {
    downloader = new Downloader;
  });

  it('should download a file with no missing data when "finish" event is emitted', function(done) {
    nock('http://www.obm.org').get('/gpl.txt')
        .replyWithFile(200, testingFilePath);

    var expectedData = fs.readFileSync(testingFilePath, 'utf8');
    downloader.on('finish', function() {
      fs.readFile(destination, 'utf8', function(err, dataFromFile) {
        if (err) throw err;
        expect(dataFromFile).to.equal(expectedData);
        done();
      });
    });
    downloader.download(url, destination);
  });

  it('should send an event "error" on error with the file system', function(done) {
    nock('http://www.obm.org').get('/gpl.txt')
        .reply(200, 'Hello world !');

    downloader.on('error', function(err) {
      err.message.should.have.string('/unkownDir/foo.txt');
      done();
    });
    downloader.download(url, '/unkownDir/foo.txt');
  });

  it('should send an event "error" on error with the url', function(done) {
    nock('http://www.obm.org').get('/gpl.txt')
        .reply(404);

    downloader.on('error', function(err) {
      err.should.equal('Not Found');
      done();
    });
    downloader.download(url, destination);
  });

  after(function(done) {
    fs.unlink(destination, function(err) {
      if (err) throw err;
      done();
    });
  });

});
