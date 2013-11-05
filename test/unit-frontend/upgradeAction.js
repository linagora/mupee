'use strict';

/* global chai: false */

var expect = chai.expect;

var q;

describe('The mupeeUpgradeAction Angular module', function() {

  beforeEach(module('mupeeUpgradeAction'));
  beforeEach(
    inject(function($q) {
      q = $q;
    })
  );

  var pPservice, aLDservice, ePService;

  beforeEach(inject(function(productPredicates, actionListDisplay, extensionPredicates) {
    pPservice = productPredicates;
    aLDservice = actionListDisplay;
    ePService = extensionPredicates;
  }));

  describe(', the productPredicates service', function() {

    it('should return a product predicate if product is given and version is nullish', function() {
      var predicates = pPservice('Firefox');

      expect(predicates).to.deep.equal([{
        id: 'productEquals',
        parameters: { product: 'Firefox' }
      }]);
    });

    it('should return a product predicate and a branch predicate if product and version are given', function() {
      var predicates = pPservice('Firefox', 12);

      expect(predicates).to.deep.equal([{
        id: 'productEquals',
        parameters: { product: 'Firefox' }
      }, {
        id: 'branchEquals',
        parameters: { branch: 12 }
      }]);
    });

  });

  describe(', the extensionPredicates service', function() {

    it('should return a product predicate if only product is given', function() {
      var predicates = ePService('Firefox');

      expect(predicates).to.deep.equal([{
        id: 'extProductEquals',
        parameters: { product: 'Firefox' }
      }]);
    });

    it('should return product and branch predicates if product and version are given', function() {
      var predicates = ePService('Firefox', 12);

      expect(predicates).to.deep.equal([{
        id: 'extProductEquals',
        parameters: { product: 'Firefox' }
      }, {
        id: 'extBranchEquals',
        parameters: { branch: 12 }
      }]);
    });

    it('should return a product, branch and id predicates if product, version and id are given', function() {
      var predicates = ePService('Firefox', 12, 'myExtensionId');

      expect(predicates).to.deep.equal([{
        id: 'extProductEquals',
        parameters: { product: 'Firefox' }
      }, {
        id: 'extBranchEquals',
        parameters: { branch: 12 }
      }, {
        id: 'extIdEquals',
        parameters: { id: 'myExtensionId' }
      }]);
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
