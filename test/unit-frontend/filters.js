'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The joinWithDefault filter', function() {
  var filter;

  beforeEach(module('mupeeFilters'));
  beforeEach(inject(function(joinWithDefaultFilter) {
    filter = joinWithDefaultFilter;
  }));

  it('should join a non-empty array on comma/space \', \'', function() {
    expect(filter(['One', 'Two'])).to.equal('One, Two');
  });

  it('should output the default value if array is empty', function() {
    expect(filter([], 'Def')).to.equal('Def');
  });

  it('should output the default value if array is null', function() {
    expect(filter(null, 'Def')).to.equal('Def');
  });

  it('should output the default value if array is undefined', function() {
    expect(filter()).to.not.exists;
  });

});
