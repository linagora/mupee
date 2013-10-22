'use strict';

/* global chai: false */

var expect = chai.expect;
var assert = chai.assert;

describe('mupeeRouteSegment', function() {

  beforeEach(angular.mock.module('mupeeRouteSegment'));

  it('should contain an mupeeRouteSegment service', inject(function(mupeeRouteSegment) {
    expect(mupeeRouteSegment).not.to.equal(null);
  }));

  it('should contain a working mupeeRouteSegment service', inject(function(mupeeRouteSegment) {
    expect(mupeeRouteSegment.getLocationSegments).not.to.equal(null);
  }));

  it('When location is \'/Firefox\'', inject(function($browser, $location, mupeeRouteSegment) {
    $location.path('/Firefox');
    $browser.poll();

    describe('getLocationSegments()', function() {
      var segments = mupeeRouteSegment.getLocationSegments();

      it('should send an array', function() {
        expect(segments).to.be.an('array');
      });

      it('should send the array [\'Firefox\']', function() {
        assert.deepEqual(segments, ['Firefox']);
      });
    });
  }));

  it('When location is \'/\'', inject(function($browser, $location, mupeeRouteSegment) {
    $location.path('/');
    $browser.poll();

    describe('getLocationSegments()', function() {
      var segments = mupeeRouteSegment.getLocationSegments();

      it('should send an array', function() {
        expect(segments).to.be.an('array');
      });

      it('should send the array []', function() {
        assert.deepEqual(segments, []);
      });
    });
  }));

  it('When location is \'/Firefox?test=true\'', inject(function($browser, $location, mupeeRouteSegment) {
    $location.path('/Firefox');
    $location.search({'test': 'true'});
    $browser.poll();

    describe('getLocationSegments()', function() {
      var segments = mupeeRouteSegment.getLocationSegments();

      it('should send an array', function() {
        expect(segments).to.be.an('array');
      });

      it('should send the array [\'Firefox\']', function() {
        assert.deepEqual(segments, ['Firefox']);
      });
    });
  }));


  it('When location is \'/Firefox/versions', inject(function($browser, $location, mupeeRouteSegment) {
    $location.path('/Firefox/versions');
    $browser.poll();
    describe('getLocationSegments()', function() {
      var segments = mupeeRouteSegment.getLocationSegments();
      it('should send an array', function() {
        expect(segments).to.be.an('array');
      });
      it('should send the array [\'Firefox\', \'versions\']', function() {
        assert.deepEqual(segments, ['Firefox', 'versions']);
      });
    });
  }));
});
