'use strict';

/* global chai: false */

var expect = chai.expect;

describe('mupeeProduct', function() {
  var serverResponseFirefox = [
    {
      'product': 'Firefox',
      'version': '3.5.2',
      'buildID': '20090729225027',
      'buildTarget': 'WINNT_x86-msvc',
      'locale': 'en-US',
      'channel': 'release',
      'osVersion': 'Windows_NT%206.0',
      'branch': '3',
      'parameters': {},
      'updates': [
        {
          'type': 'minor',
          'version': '3.6.18',
          'extensionVersion': '3.6.18',
          'displayVersion': null,
          'appVersion': null,
          'platformVersion': null,
          'buildID': '20110614230723',
          'detailsURL': 'https://www.mozilla.com/en-US/firefox/3.6/details/',
          'patches': [
            {
              'type': 'complete',
              'URL': 'http://download.mozilla.org/?product=firefox-3.6.18-complete&os=win&lang=en-US',
              'localPath': null,
              'hashFunction': 'SHA512',
              'hashValue': '345835da0d15607d115cef2a42185f0cdc0d800bde0a0039aac786c370732e2b3855cd0b70a6de390ad49d52f7adfd8df56cd9c69f2b44211ba0bb792d47e59b',
              'size': '11587247'
            }, {
              'type': 'partial',
              'URL': 'http://download.mozilla.org/?product=firefox-3.6.18-complete&os=win&lang=en-US',
              'localPath': null,
              'hashFunction': 'SHA512',
              'hashValue': '345835da0d15607d115cef2a42185f0cdc0d800bde0a0039aac786c370732e2b3855cd0b70a6de390ad49d52f7adfd8df56cd9c69f2b44211ba0bb792d47e59b',
              'size': '11587247'
            }
          ]
        }, {
          'type': 'major',
          'version': '10.0.2',
          'extensionVersion': '10.0.2',
          'displayVersion': null,
          'appVersion': null,
          'platformVersion': null,
          'buildID': '20110614230724',
          'detailsURL': 'https://www.mozilla.com/en-US/firefox/10.0/details/',
          'patches': []
        }
      ],
      '_id': '52570bf9356576df7c000001'
    }
  ];
  var mupeeProductFirefoxMock = {
    getCurrent: function() { return 'Firefox'; }
  };

  var versionAPIFirefoxSuccessMock = {
    getProductVersions: function(product, callback) {
      this.callback = callback;
    },
    flush: function() {
      this.callback(null, serverResponseFirefox);
    }
  };

  var versionAPIFirefoxFailureMock = {
    getProductVersions: function(product, callback) {
      this.callback = callback;
    },
    flush: function() {
      this.callback(500, 'Internal server error', 500);
    }
  };

  beforeEach(module('mupeeProduct'));

  describe('when displaying Firefox versions', function() {
    var scope;
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      $controller('productHome', {
        mupeeProduct: mupeeProductFirefoxMock,
        versionAPI: versionAPIFirefoxSuccessMock,
        $scope: scope
      });
    }));
    describe('when the server response is not there yet', function() {
      it('should not have majorVersions set', function() {
        expect(scope.versions).to.be.an.array;
        expect(scope.versions).to.have.length(0);
      });
      it('should have the loadProgress flag set', function() {
        expect(scope.loadProgress).to.be.true;
      });
      it('should not have the networkError flag set', function() {
        expect(scope.networkError).to.be.false;
      });
    });
  });

  describe('when displaying Firefox versions', function() {
    var scope;
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      $controller('productHome', {
        mupeeProduct: mupeeProductFirefoxMock,
        versionAPI: versionAPIFirefoxSuccessMock,
        $scope: scope
      });
    }));

    it('receive a correct server answer', function() {
      versionAPIFirefoxSuccessMock.flush();
      it('should have majorVersions set', function() {
        expect(scope.majorVersions).to.be.an.array;
        expect(scope.majorVersions).to.have.length(1);
        expect(scope.majorVersions[0]).to.equal('3');
      });
      it('should no have the loadProgress flag set', function() {
        expect(scope.loadProgress).to.be.false;
      });
      it('should no have the networkError flag set', function() {
        expect(scope.networkError).to.be.false;
      });
    });
  });

  describe('when displaying Firefox versions', function() {
    var scope;
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      $controller('productHome', {
        mupeeProduct: mupeeProductFirefoxMock,
        versionAPI: versionAPIFirefoxFailureMock,
        $scope: scope
      });
    }));

    it('receive a 500 server answer', function() {
      versionAPIFirefoxFailureMock.flush();
      it('should not have majorVersions set', function() {
        expect(scope.majorVersions).to.be.an.array;
        expect(scope.majorVersions).to.have.length(0);
      });
      it('should no have the loadProgress flag set', function() {
        expect(scope.loadProgress).to.be.false;
      });
      it('should have the networkError flag set', function() {
        expect(scope.networkError).to.be.true;
      });
    });
  });
});
