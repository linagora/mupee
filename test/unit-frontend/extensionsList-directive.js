'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The extensionsList directive', function() {
  var $s, $c, $h;

  beforeEach(module('mupeeExtensionsList', 'directives/extensionsList'));
  beforeEach(inject(function($rootScope, $compile, $httpBackend) {
    $s = $rootScope;
    $c = $compile;
    $h = $httpBackend;
  }));

  it('should display \'No extensions...\' if backend sends no extensions (no filter)', function(done) {
    $h.expectGET('/admin/extensions?').respond([]);

    var element = $c('<div data-extensions-list></div>')($s);

    $s.$digest();

    expect(
        element
          .children('[data-ng-show*="DISPLAY"]')
          .children()
          .html()).to.equal('No   extensions are currently registered');
    done();
  });

  it('should display \'No extensions...\' if backend sends no extensions (product=Thunderbird)', function(done) {
    $h.expectGET('/admin/extensions?product=Thunderbird').respond([]);

    var element = $c('<div data-extensions-list data-product="Thunderbird"></div>')($s);

    $s.$digest();

    expect(
        element
          .children('[data-ng-show*="DISPLAY"]')
          .children()
          .html()).to.equal('No Thunderbird  extensions are currently registered');
    done();
  });

  it('should display \'No extensions...\' if backend sends no extensions (product=Thunderbird, version=24)', function(done) {
    $h.expectGET('/admin/extensions?branch=24&product=Thunderbird').respond([]);

    var element = $c('<div data-extensions-list data-product="Thunderbird" data-version="24"></div>')($s);

    $s.$digest();

    expect(
        element
          .children('[data-ng-show*="DISPLAY"]')
          .children()
          .html()).to.equal('No Thunderbird 24 extensions are currently registered');
    done();
  });

});
