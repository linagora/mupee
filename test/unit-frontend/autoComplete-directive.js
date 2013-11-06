'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The autoComplete directive', function() {
  var $scope, $c, $h;

  beforeEach(module('mupeeAutoComplete', 'directives/autoComplete'));
  beforeEach(inject(function($rootScope, $compile, $httpBackend) {
    $scope = $rootScope;
    $c = $compile;
    $h = $httpBackend;
  }));

  function digest() {
    $scope.$digest();
    $h.flush();
  }

  it('should add a \'list\' attribute with value uuid to the input tag', function(done) {
    $h.expectGET('/autocomplete/datalist?').respond({});

    var input = $c('<input data-auto-complete/>')($scope);
    digest();

    expect(input.attr('list')).to.be.a('string');
    expect(input.attr('list')).not.to.be.empty;
    done();
  });

  it('should return an empty array if no response.data is sent', function(done) {
    $h.expectGET('/autocomplete/datalist?').respond({});

    var input = $c('<input data-auto-complete/>')($scope);
    digest();

    var datalist = input.find('datalist');
    expect(datalist.length).to.equal(1);
    expect(datalist.find('option').length).to.equal(0);
    done();
  });

  it('should add a \'datalist\' child of id uuid with a list of option childs', function(done) {
    var response = {};
    response.data = ['3.2.0.11', '3.2.0.10+git2013-06-06_99_389179e'];
    $h.expectGET('/autocomplete/datalist?').respond(response);

    var input = $c('<input data-auto-complete/>')($scope);
    digest();

    var datalist = input.find('datalist');
    var option = datalist.find('option');

    expect(input.attr('list')).to.equal(datalist.attr('id'));
    expect(option.attr('value')).to.equal('["3.2.0.11","3.2.0.10+git2013-06-06_99_389179e"]');
    done();
  });

  it('should have a proper scope to GET the endpoint', function(done) {
    $h.expectGET('/autocomplete/datalist?id=id&product=product&property=property' +
                 '&targetMode=mode&version=version').respond({});

    $c('<input data-auto-complete data-id="id" data-property="property" data-target-mode="mode" ' +
       'data-version="version" data-product="product"/>')($scope);
    digest();

    done();
  });
});
