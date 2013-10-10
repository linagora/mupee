"use strict";

var expect = chai.expect;

describe("mupeeVersion", function () {
 
  beforeEach(angular.mock.module('mupeeVersion'));

  describe("versionAPI service", function () {

    var serverResponseFirefox=[ { "product": "Firefox", "version": "3.5.2", "buildId": "20090729225027", "buildTarget": "WINNT_x86-msvc", "locale": "en-US", "channel": "release", "osVersion": "Windows_NT%206.0", "branch": "3", "parameters": {}, "updates": [ { "type": "minor", "version": "3.6.18", "extensionVersion": "3.6.18", "displayVersion": null, "appVersion": null, "platformVersion": null, "buildId": "20110614230723", "detailsUrl": "https://www.mozilla.com/en-US/firefox/3.6/details/", "patches": [ { "type": "complete", "url": "http://download.mozilla.org/?product=firefox-3.6.18-complete&os=win&lang=en-US", "localPath": null, "hashFunction": "SHA512", "hashValue": "345835da0d15607d115cef2a42185f0cdc0d800bde0a0039aac786c370732e2b3855cd0b70a6de390ad49d52f7adfd8df56cd9c69f2b44211ba0bb792d47e59b", "size": "11587247" }, { "type": "partial", "url": "http://download.mozilla.org/?product=firefox-3.6.18-complete&os=win&lang=en-US", "localPath": null, "hashFunction": "SHA512", "hashValue": "345835da0d15607d115cef2a42185f0cdc0d800bde0a0039aac786c370732e2b3855cd0b70a6de390ad49d52f7adfd8df56cd9c69f2b44211ba0bb792d47e59b", "size": "11587247" } ] }, { "type": "major", "version": "10.0.2", "extensionVersion": "10.0.2", "displayVersion": null, "appVersion": null, "platformVersion": null, "buildId": "20110614230724", "detailsUrl": "https://www.mozilla.com/en-US/firefox/10.0/details/", "patches": [] } ], "_id": "52570bf9356576df7c000001" } ];
    var serverResponseThunderbird=[];
    
    var vAPI, httpBackend;
    beforeEach(angular.mock.inject(function (versionAPI, $httpBackend) {
      vAPI = versionAPI;
      httpBackend = $httpBackend;
      httpBackend.when("GET", "/admin/versions?product=Firefox").respond(serverResponseFirefox);
      httpBackend.when("GET", "/admin/versions?product=Thunderbird").respond(serverResponseThunderbird);
    }));

    describe("when product is Firefox", function() {
      var product = "Firefox";
    
      it("should have one sourceVersion", function (done) {
        vAPI.getProductVersions(product, function(err,resp) {
          expect(err).to.be.null;
          expect(resp).to.be.an.array;
          expect(resp).to.have.length(1);
          expect(resp[0].version).not.to.be.undefined;
          expect(resp[0].version).to.equal("3.5.2");
          done();
        });
        httpBackend.flush();
      });
    });
    describe("when product is Thunderbird", function() {
      var product = "Thunderbird";
    
      it("should have no sourceVersion", function (done) {
        vAPI.getProductVersions(product, function(err,resp) {
          expect(err).to.be.null;
          expect(resp).to.be.an.array;
          expect(resp).to.have.length(0);
          done();
        });
        httpBackend.flush();
      });
    });
  });
});