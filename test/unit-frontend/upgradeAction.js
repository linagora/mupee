'use strict';

/* global chai: false */

var expect = chai.expect;

var q;

describe('The mupeeUpgradeAction Angular module', function() {

  beforeEach(angular.mock.module('mupeeUpgradeAction'));

  beforeEach(
    inject(function($q) {
      q = $q;
    })
  );

  var pAVPservice;
  var aLDservice;
  beforeEach(inject(function(productAndVersionPredicates, actionListDisplay) {
    pAVPservice = productAndVersionPredicates;
    aLDservice = actionListDisplay;
  }));

  describe(', the productAndVersionPredicates service', function() {

    it('should return a product predicate if product is given and version is nullish', function() {
      var predicates = pAVPservice('Firefox');
      expect(predicates).to.exist;
      expect(predicates).to.be.an.array;
      expect(predicates).to.have.length(1);
      expect(predicates[0]).to.be.an.object;
      expect(predicates[0].id).to.exist;
      expect(predicates[0].id).to.equal('productEquals');
      expect(predicates[0].parameters).to.exit;
      expect(predicates[0].parameters).to.be.an.object;
      expect(predicates[0].parameters.product).to.exit;
      expect(predicates[0].parameters.product).to.equal('Firefox');


    });

    it('should return a product predicate and a branch predicate if product and version are given', function() {
      var predicates = pAVPservice('Firefox', 12);
      expect(predicates).to.exist;
      expect(predicates).to.be.an.array;
      expect(predicates).to.have.length(2);
      expect(predicates[0].id).to.exist;
      expect(predicates[0].id).to.equal('productEquals');
      expect(predicates[0].parameters).to.exit;
      expect(predicates[0].parameters).to.be.an.object;
      expect(predicates[0].parameters.product).to.exit;
      expect(predicates[0].parameters.product).to.equal('Firefox');
      expect(predicates[1].id).to.exist;
      expect(predicates[1].id).to.equal('branchEquals');
      expect(predicates[1].parameters).to.exit;
      expect(predicates[1].parameters).to.be.an.object;
      expect(predicates[1].parameters.branch).to.exit;
      expect(predicates[1].parameters.branch).to.equal(12);
    });

  });

  describe('the actionListDisplay service', function() {
    it('should be a function', function() {
      expect(aLDservice).to.be.a.function;
    });

    it('should format the action summary in text', function() {
      var action = {summary: 'I\'m a teapot', parametersDefinitions: []};
      var actionString = aLDservice(action, {id: 'test', parameters: {}});
      expect(actionString).to.equal('I\'m a teapot');
    });

    it('should format the action summary and parameters in text', function() {
      var action = {summary: 'I\'m a teapot', parametersDefinitions: [
        {
          id: 'branch',
          summary: 'version branch',
          description: 'a Mozilla product version branch',
          type: 'number',
          mandatory: true
        },
        {
          id: 'product',
          summary: 'product name',
          description: 'a Mozilla product name',
          type: 'string',
          mandatory: true
        }
      ]};
      var actionString = aLDservice(action, {id: 'test', parameters: {branch: 14, product: 'Firefox'}});
      expect(actionString).to.equal('I\'m a teapot (version branch: 14, product name: Firefox)');
    });

    it('should forgive a missing parameter', function() {

      var action = {summary: 'I\'m a teapot', parametersDefinitions: [
        {
          id: 'branch',
          summary: 'version branch',
          description: 'a Mozilla product version branch',
          type: 'number',
          mandatory: true
        },
        {
          id: 'product',
          summary: 'product name',
          description: 'a Mozilla product name',
          type: 'string',
          mandatory: true
        }
      ]};
      var actionString = aLDservice(action, {id: 'test', parameters: {product: 'Firefox'}});
      expect(actionString).to.equal('I\'m a teapot (product name: Firefox)');
    });

    it('should forgive un unkown parameter', function() {

      var action = {summary: 'I\'m a teapot', parametersDefinitions: [
        {
          id: 'branch',
          summary: 'version branch',
          description: 'a Mozilla product version branch',
          type: 'number',
          mandatory: true
        },
        {
          id: 'product',
          summary: 'product name',
          description: 'a Mozilla product name',
          type: 'string',
          mandatory: true
        }
      ]};
      var actionString = aLDservice(action, {id: 'test', parameters: {branch: 14, product: 'Firefox', trend: 'India'}});
      expect(actionString).to.equal('I\'m a teapot (version branch: 14, product name: Firefox)');
    });

  });

});
