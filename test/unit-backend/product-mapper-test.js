'use strict';

var expect = require('chai').expect;

var mapper = require('../../backend/product-mapper');

describe('The ProductMapper module', function() {

  it('should find Firefox as a product name', function() {
    expect(mapper.idFromName('Firefox')).to.exist;
  });

  it('should find Thunderbird as a product name', function() {
    expect(mapper.idFromName('Thunderbird')).to.exist;
  });

  it('should not find SeeMonkey as a product name', function() {
    expect(mapper.idFromName('SeeMonkey')).to.not.exist;
  });

  it('should not find Unknown as a product name', function() {
    expect(mapper.idFromName('Unknown')).to.not.exist;
  });

  it('should not find {92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a} (SeaMonkey) as a product id', function() {
    expect(mapper.nameFromId('{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}')).to.not.exist;
  });

  it('should find {3550f703-e582-4d05-9a08-453d09bdfdc6} (Thunderbird) as a product id', function() {
    expect(mapper.nameFromId('{3550f703-e582-4d05-9a08-453d09bdfdc6}')).to.exist;
  });

  it('should find {ec8030f7-c20a-464f-9b0e-13a3a9e97384} (Firefox) as a product id', function() {
    expect(mapper.nameFromId('{ec8030f7-c20a-464f-9b0e-13a3a9e97384}')).to.exist;
  });

  it('should not find {00000000-0000-0000-0000-000000000000} as a product id', function() {
    expect(mapper.nameFromId('{00000000-0000-0000-0000-000000000000}')).to.not.exist;
  });

});
