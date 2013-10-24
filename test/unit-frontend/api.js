'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The mupeeAPI angular module', function() {

  var APIService,
      buildPredicateService,
      httpBackend;

  beforeEach(angular.mock.module('mupeeAPI'));
  beforeEach(angular.mock.inject(
    function(API, $httpBackend) {
      APIService = API;
      httpBackend = $httpBackend;
    }
  ));
  beforeEach(angular.mock.inject(
    function(buildPredicate) {
      buildPredicateService = buildPredicate;
    }
  ));

  describe('the API service', function() {

    it('should be an object', function() {
      expect(APIService).to.be.an.object;
    });

    it('should have action and rule properties', function() {
      expect(APIService).to.have.property('action');
      expect(APIService).to.have.property('rule');
    });


    describe('the action property', function() {

      it('should be an object', function() {
        expect(APIService.action).to.be.an.object;
      });

      it('should have a list property', function() {
        expect(APIService.action).to.have.property('list');
      });

      it('should issue a GET request to /admin/rules/actions', function(done) {

        httpBackend.expectGET('/admin/rules/actions').respond(200, actionList());
        var promise = APIService.action.list();
        expect(promise).to.be.an.object;
        expect(promise).to.have.property('then');
        expect(promise.then).to.be.a.function;

        promise.then(function(response) {
          expect(response).to.deep.equal(actionList());
          done();
        },function() {done();});

        httpBackend.flush();

      });

    });

    describe('the rule property', function() {

      it('should be an object', function() {
        expect(APIService.rule).to.be.an.object;
      });

      it('should have a record property', function() {
        expect(APIService.rule).to.have.property('record');
      });

      describe('when rule have no id and have an action', function() {

        var postRule = {
          action: {
            id: 'latestForBranch',
            parameters: {branch: 12}
          },
          predicates: [
            {
              id: 'product',
              parameters: {product: 'Firefox'}
            }
          ]
        };

        it('should issue a POST request to the backend', function(done) {

          httpBackend.expectPOST('/admin/rules').respond(200, 'hi');
          var promise = APIService.rule.record(postRule);
          expect(promise).to.be.an.object;
          expect(promise).to.have.property('then');
          expect(promise.then).to.be.a.function;

          promise.then(function(response) {
            expect(response).to.equal('hi');
            done();
          },function() {done();});

          httpBackend.flush();

        });
      });

      describe('when rule have an _id and have an action', function() {

        var rule = {
          _id: 1337,
          action: {
            id: 'latestForBranch',
            parameters: {branch: 12}
          },
          predicates: [
            {
              id: 'product',
              parameters: {product: 'Firefox'}
            }
          ]
        };

        it('should issue a PUT request to the backend', function(done) {

          httpBackend.expectPUT('/admin/rules/1337').respond(200, 'hi');
          var promise = APIService.rule.record(rule);
          expect(promise).to.be.an.object;
          expect(promise).to.have.property('then');
          expect(promise.then).to.be.a.function;

          promise.then(function(response) {
            expect(response).to.equal('hi');
            done();
          },function() {done();});

          httpBackend.flush();

        });
      });

      describe('when rule have an _id and don\'t have an action', function() {

        var rule = {
          _id: 1337,
          predicates: [
            {
              id: 'product',
              parameters: {product: 'Firefox'}
            }
          ]
        };

        it('should issue a DELETE request to the backend', function(done) {

          httpBackend.expectDELETE('/admin/rules/1337').respond(200, 'hi');
          var promise = APIService.rule.record(rule);
          expect(promise).to.be.an.object;
          expect(promise).to.have.property('then');
          expect(promise.then).to.be.a.function;

          promise.then(function(response) {
            expect(response).to.equal('hi');
            done();
          },function() {done();});

          httpBackend.flush();

        });
      });

      describe('when rule have an _id and have action that have an id that is falsish', function() {

        var rule = {
          _id: 1337,
          action: {
            id: null
          },
          predicates: [
            {
              id: 'product',
              parameters: {product: 'Firefox'}
            }
          ]
        };

        it('should issue a DELETE request to the backend', function(done) {

          httpBackend.expectDELETE('/admin/rules/1337').respond(200, 'hi');
          var promise = APIService.rule.record(rule);
          expect(promise).to.be.an.object;
          expect(promise).to.have.property('then');
          expect(promise.then).to.be.a.function;

          promise.then(function(response) {
            expect(response).to.equal('hi');
            done();
          },function() {done();});

          httpBackend.flush();

        });
      });

      it('should have a findByPredicate property', function() {
        expect(APIService.rule).to.have.property('findByPredicate');
      });

      describe('the rule.findByPredicate function', function() {

        it('should issue a POST request to the backend', function(done) {

          httpBackend.expectPOST('/admin/rules', {predicates: 'hello'},
            {
              'X-http-method-override': 'GET',
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json;charset=utf-8'
            }
          ).respond(200, 'hi');
          var promise = APIService.rule.findByPredicate('hello');
          expect(promise).to.be.an.object;
          expect(promise).to.have.property('then');
          expect(promise.then).to.be.a.function;

          promise.then(function(response) {
            expect(response).to.equal('hi');
            done();
          },function() {done();});

          httpBackend.flush();

        });
      });

    });

  });


  function actionList() {
    return {
      deny: {
        id: 'deny',
        summary: 'deny upgrades',
        description: 'This policy disable all upgrades',
        parametersDefinitions: []
      },
      latestForBranch: {
        id: 'latestForBranch',
        summary: 'upgrade to latest release of a specified version',
        description: '',
        parametersDefinitions: [
          {
            id: 'branch',
            summary: 'Version number',
            description: 'Mozilla product major version number (i.e. "17")',
            type: 'string',
            mandatory: true,
            defaultValue: 'minor'
          }
        ]
      }
    };
  }

  describe('the buildPredicate service', function() {
    describe('when given id and parameters arguments', function() {
      it('should give back a predicate data structure', function() {
        var test = buildPredicateService('pid', 'pparameters');
        expect(test.id).to.exist;
        expect(test.id).to.equal('pid');
        expect(test.parameters).to.exist;
        expect(test.parameters).to.equal('pparameters');
      });
    });
  });

});
