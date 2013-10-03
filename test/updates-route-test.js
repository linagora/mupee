'use strict';

var should = require('chai').should(),
    mongo = require('mongoskin'),
    request = require('request'),
    nock = require('nock');

describe('The Updates route', function() {
    var db;
    var baseUri;

    before(function() {
        baseUri = 'http://localhost:1234';
        db = mongo.db('localhost:27017/mozilla-updater?auto_reconnect', {safe: true});
    });

    describe('should store the client version, and respond with available updates', function(done) {

 
        it('when defined version and extensionVersion', function(done) {
            var resource = '/update/3/Firefox/3.5.2/20090729225027/WINNT_x86-msvc/en-US/release/' +
                           'Windows_NT%206.0/default/default/update.xml';
            var replyXML = '<?xml version="1.0" encoding=\"UTF-8\"?>\n' +
                   '<updates>' +
                     '<update type="minor" version="3.6.18" extensionVersion="3.6.18" buildID="20110614230723" ' +
                         'detailsURL="https://www.mozilla.com/en-US/firefox/3.6/details/">' +
                       '<patch type="complete" URL="http://download.mozilla.org/?product=firefox-3.6.18-complete' +
                           '&amp;os=win&amp;lang=en-US" hashFunction="SHA512" hashValue="345835da0d15607d115cef2a42' +
                           '185f0cdc0d800bde0a0039aac786c370732e2b3855cd0b70a6de390ad49d52f7adfd8df56cd9c69f2b44211' +
                           'ba0bb792d47e59b" size="11587247"/>' +
                       '<patch type="partial" URL="http://download.mozilla.org/?product=firefox-3.6.18-complete' +
                           '&amp;os=win&amp;lang=en-US" hashFunction="SHA512" hashValue="345835da0d15607d115cef2a42' +
                           '185f0cdc0d800bde0a0039aac786c370732e2b3855cd0b70a6de390ad49d52f7adfd8df56cd9c69f2b44211' +
                           'ba0bb792d47e59b" size="11587247"/>' +
                     '</update>' +
                   '</updates>';

            var mockedMozillaServer = nock('https://aus2.mozilla.org')
                .get(resource)
                .once()
                .reply(
                    200,
                    replyXML
            );

            request.get(baseUri + resource,
                function(error, response, body) {
                    if (error) throw error;
                    response.statusCode.should.equal(200);
                    body.should.equal(replyXML);
                    should.exist(db.collection('source-versions').findOne({product: 'Firefox'}, done));
                }
            );
        });
        
        it('when defined with appVersion, platformVersion and displayVersion', function(done) {
            var resource = '/update/3/Thunderbird/12.0.1/20120428123112/WINNT_x86-msvc/fr/release/' +
                           'Windows_NT%205.1.3.0%20(x86)/default/default/update.xml?force=1';
            var replyXML = '<?xml version="1.0" encoding=\"UTF-8\"?>\n' +
                           '<updates>' +
                             '<update type="minor" displayVersion="24.0" appVersion="24.0" platformVersion="24.0" ' +
                                 'buildID="20130911175743" detailsURL="http://live.mozillamessaging.com/thunderbird' +
                                 '/releasenotes?locale=fr&amp;platform=win32&amp;version=24.0">' +
                               '<patch type="complete" URL="http://download.mozilla.org/?product=thunderbird-24.0' +
                                   '-complete&amp;os=win&amp;lang=fr&amp;force=1" hashFunction="SHA512" ' +
                                   'hashValue="e70cb44daaeca678ebbc41c347ed87973c8e10253e4b72d9373beb2201fc61ac692d' +
                                   '937e6b05f3f78062e150d326089cb1b6efb4e246d01758b8a1cb99587d7c" size="27118476"/>' +
                             '</update>' +
                           '</updates>';
            
            var mockedMozillaServer = nock('https://aus2.mozilla.org')
                .get(resource)
                .once()
                .reply(
                    200,
                    replyXML
            );

            request.get(baseUri + resource,
                function(error, response, body) {
                    if (error) throw error;
                    response.statusCode.should.equal(200);
                    body.should.equal(replyXML);
                    should.exist(db.collection('source-versions').findOne({product: 'Thunderbird'}, done));
                }
            );
        });
    });
    after(function(done) {
        db.collection('source-versions').drop(function() {
            db.close(done);
        });
    });
});
