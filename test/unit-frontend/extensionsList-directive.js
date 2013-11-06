'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The extensionsList directive', function() {
  var $scope, $c, $h;

  beforeEach(module('mupeeExtensionsList', 'directives/extensionsList'));
  beforeEach(inject(function($rootScope, $compile, $httpBackend) {
    $scope = $rootScope;
    $c = $compile;
    $h = $httpBackend;
  }));

  function digest() {
    $scope.$digest();
    $h.flush();
  }

  it('should display only an upgradeAction directive if backend sends no extensions (no filter)', function(done) {
    $h.expectGET('/admin/extensions?').respond([]);

    var element = $c('<div data-extensions-list></div>')($scope);

    digest();

    var rootElement = element.children('[data-ng-show*="DISPLAY"]').children();

    expect(rootElement.hasClass('ng-hide')).to.be.false;
    expect(rootElement.find('.pointer').hasClass('ng-hide')).to.be.true;
    expect(rootElement.find('[data-upgrade-action]').length).to.equal(1);
    done();
  });

  it('should display only an upgradeAction directive if backend sends no extensions (product=Thunderbird)', function(done) {
    $h.expectGET('/admin/extensions?product=Thunderbird').respond([]);

    var element = $c('<div data-extensions-list data-product="Thunderbird"></div>')($scope);

    digest();

    var rootElement = element.children('[data-ng-show*="DISPLAY"]').children();

    expect(rootElement.hasClass('ng-hide')).to.be.false;
    expect(rootElement.find('.pointer').hasClass('ng-hide')).to.be.true;
    expect(rootElement.find('[data-upgrade-action]').length).to.equal(1);
    done();
  });

  it('should display only an upgradeAction directive if backend sends no extensions (product=Thunderbird, version=24)', function(done) {
    $h.expectGET('/admin/extensions?branch=24&product=Thunderbird').respond([]);

    var element = $c('<div data-extensions-list data-product="Thunderbird" data-version="24"></div>')($scope);

    digest();

    var rootElement = element.children('[data-ng-show*="DISPLAY"]').children();

    expect(rootElement.hasClass('ng-hide')).to.be.false;
    expect(rootElement.find('.pointer').hasClass('ng-hide')).to.be.true;
    expect(rootElement.find('[data-upgrade-action]').length).to.equal(1);
    done();
  });

  it('should display one extension if backend sends one extension', function(done) {
    $h.expectGET('/admin/extensions?').respond([{
      id: 'id',
      name: 'name',
      version: '1.0'
    }]);

    var element = $c('<div data-extensions-list></div>')($scope);

    digest();

    var rootElement = element.children('[data-ng-show*="DISPLAY"]').find('article');
    var extNames = rootElement.find('.row.minor-versions > div > span');

    expect(rootElement.hasClass('ng-hide')).to.be.false;
    expect(extNames.length).to.equal(1);
    expect(extNames[0].innerHTML).to.equal('name');
    done();
  });

  it('should display two extensions if backend sends two extension', function(done) {
    $h.expectGET('/admin/extensions?').respond([{
      id: 'id1',
      name: 'name1',
      version: '1.0'
    }, {
      id: 'id2',
      name: 'name2',
      version: '1.0'
    }]);

    var element = $c('<div data-extensions-list></div>')($scope);

    digest();

    var rootElement = element.children('[data-ng-show*="DISPLAY"]').find('article');
    var extNames = rootElement.find('.row.minor-versions > div > span');

    expect(rootElement.hasClass('ng-hide')).to.be.false;
    expect(extNames.length).to.equal(2);
    expect(extNames[0].innerHTML).to.equal('name1');
    expect(extNames[1].innerHTML).to.equal('name2');
    done();
  });

  it('should group extensions by name', function(done) {
    $h.expectGET('/admin/extensions?').respond([{
      id: 'id1',
      name: 'name1',
      version: '1.0'
    }, {
      id: 'id2',
      name: 'name2',
      version: '1.0'
    }, {
      id: 'id2',
      name: 'name2',
      version: '2.0'
    }]);

    var element = $c('<div data-extensions-list></div>')($scope);

    digest();

    var rootElement = element.children('[data-ng-show*="DISPLAY"]').find('article');
    var extNames = rootElement.find('.row.minor-versions > div > span');

    expect(rootElement.hasClass('ng-hide')).to.be.false;
    expect(extNames.length).to.equal(2);
    expect(extNames[0].innerHTML).to.equal('name1');
    expect(extNames[1].innerHTML).to.equal('name2');
    done();
  });

});
