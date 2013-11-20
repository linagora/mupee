'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The upgradeAction Angular directive', function(done) {
  var $compile, $rootScope, $httpBackend;
  var nextTick = function(callback) {
    setTimeout(callback, 0);
  };
  beforeEach(module('mupeeUpgradeAction', 'directives/upgradeAction'));
  beforeEach(inject(
    ['$compile', '$rootScope', '$httpBackend', function($c, $r, $h) {
      $compile = $c;
      $rootScope = $r;
      $httpBackend = $h;
    }]
  ));

  it('should emit onRESTComplete event when it is done querying the backend', function(done) {
    $httpBackend.expectPOST('/admin/rules/actions').respond({});
    $httpBackend.expectPOST('/admin/rules').respond(404);
    $rootScope.product = 'Firefox';

    var $scope = $rootScope.$new();
    $scope.$on('onRESTComplete', function() {
      done();
    });
    $compile('<div data-upgrade-action data-product="product" data-version="version"></div>')($scope);
    $scope.$digest();
    $httpBackend.flush();
  });

  it('should load data from the server for a product', function(done) {
    $httpBackend.expectPOST('/admin/rules/actions').respond(mockrulesAction());
    $httpBackend.expectPOST('/admin/rules').respond(mockFindByPredicate());
    $rootScope.product = 'Firefox';

    var $scope = $rootScope.$new();
    var element = $compile('<div data-upgrade-action data-product="product" data-version="version"></div>')($scope);
    $scope.$digest();

    $scope.$on('onRESTComplete', function() {
      var editButton = element.find('[data-ng-click="startEdition()"]'),
      displayContainer = element.children('[data-ng-show*="DISPLAY"]'),
      editionContainer = element.children('[data-ng-show*="EDIT"]');

      // we are in a digest phase, the setTimeout ensure we run the tests on the next loop iteration
      nextTick(function() {
        expect(editButton.html()).to.equals('deny upgrades <img src="../../images/gear.png" class="edit-icon">');

        editButton.click();
        $scope.$digest();

        expect(displayContainer.hasClass('ng-hide')).to.be.true;
        expect(editionContainer.hasClass('ng-hide')).to.be.false;
        expect(editionContainer.find('option').length).to.equals(2);
        expect(editionContainer.find('option').eq(0).attr('value')).to.equal('deny');
        expect(editionContainer.find('option').eq(0).is(':selected')).to.be.true;
        expect(editionContainer.find('option').eq(1).attr('value')).to.equal('latestForBranch');
        done();
      });

    });

    $httpBackend.flush();
  });

  it('should load data from the server for a product and a branch', function(done) {
    $httpBackend.expectPOST('/admin/rules/actions').respond(mockrulesAction());
    $httpBackend.expectPOST('/admin/rules').respond(mockFindByPredicate());
    $rootScope.product = 'Firefox';
    $rootScope.version = {majorVersion: 17};

    var $scope = $rootScope.$new();
    var element = $compile('<div data-upgrade-action data-product="product" data-version="version"></div>')($scope);

    $scope.$digest();
    $scope.$on('onRESTComplete', nextTick(function() {
      var editButton = element.find('[data-ng-click="startEdition()"]'),
      recordButton = element.find('input[type=submit]'),
      displayContainer = element.children('[data-ng-show*="DISPLAY"]'),
      editionContainer = element.children('[data-ng-show*="EDIT"]');

      expect(editButton.html()).to.equals('deny upgrades <img src="../../images/gear.png" class="edit-icon">');
      expect(recordButton.length).to.equals(1);

      editButton.click();
      $scope.$digest();
      expect(displayContainer.hasClass('ng-hide')).to.be.true;
      expect(editionContainer.hasClass('ng-hide')).to.be.false;
      expect(editionContainer.find('option').length).to.equals(3);
      expect(editionContainer.find('option').eq(0).attr('value')).to.equal('_inherited');
      expect(editionContainer.find('option').eq(1).attr('value')).to.equal('deny');
      expect(editionContainer.find('option').eq(2).attr('value')).to.equal('latestForBranch');

      done();
    }));
    $httpBackend.flush();
  });

  it('should send correct form data to the server', function(done) {
    var recorded;

    $httpBackend.expectPOST('/admin/rules/actions').respond(mockrulesAction());
    $httpBackend.expectPOST('/admin/rules').respond(mockFindByPredicate());
    $rootScope.product = 'Firefox';
    $rootScope.branchDetail = {branch: 17};

    var $scope = $rootScope.$new();
    var element = $compile('<div data-upgrade-action data-product="product" data-version="branchDetail.branch"></div>')($scope);

    $scope.$on('onRESTcomplete', nextTick(function() {
      var editButton = element.find('[data-ng-click="startEdition()"]'),
      recordButton = element.find('input[type=submit]'),
      displayContainer = element.children('[data-ng-show*="DISPLAY"]'),
      editionContainer = element.children('[data-ng-show*="EDIT"]');

      expect(editButton.html()).to.equals('deny upgrades <img src="../../images/gear.png" class="edit-icon">');
      expect(recordButton.length).to.equals(1);

      editButton.click();
      $scope.$digest();
      expect(displayContainer.hasClass('ng-hide')).to.be.true;
      expect(editionContainer.hasClass('ng-hide')).to.be.false;
      expect(editionContainer.find('option').length).to.equals(3);
      expect(editionContainer.find('option').eq(0).attr('value')).to.equal('_inherited');
      expect(editionContainer.find('option').eq(1).attr('value')).to.equal('deny');
      expect(editionContainer.find('option').eq(2).attr('value')).to.equal('latestForBranch');
      expect(editionContainer.find('input[type=number]').length).to.equal(0);

      editionContainer.find('select').val('latestForBranch');
      editionContainer.find('option').eq(0).removeAttr('selected', false);
      editionContainer.find('option').eq(2).attr('selected', 'selected');
      editionContainer.find('select').change();

      $scope.$digest();

      expect(editionContainer.find('input[type=number]').length).to.equal(1);
      expect(editionContainer.find('input[type=number]').attr('placeholder')).to.equal('Version number');

      editionContainer.find('input[type=number]').val('24').trigger('input');
      $scope.$digest();

      $httpBackend.expectPUT('/admin/rules/526971f012b9b47610000002', function(data) { recorded = data; return true; }).respond(mockFindByPredicate());
      recordButton.click();
      $httpBackend.flush();
      recorded = JSON.parse(recorded);
      expect(recorded).to.exist;
      expect(recorded).to.be.an.object;
      expect(recorded).to.have.property('rule');
      expect(recorded.rule).to.exist;
      expect(recorded.rule.action).to.exist;
      expect(recorded.rule._id).to.equal('526971f012b9b47610000002');
      expect(recorded.rule.predicates).to.be.an.array;
      expect(recorded.rule.predicates).to.have.length(2);
      expect(recorded.rule.predicates[0].id).to.equal('extProductEquals');
      expect(recorded.rule.predicates[0].parameters.product).to.equal('Firefox');
      expect(recorded.rule.predicates[1].id).to.equal('extBranchEquals');
      expect(recorded.rule.predicates[1].parameters.branch).to.be.a.number;
      expect(recorded.rule.predicates[1].parameters.branch).to.equal(17);
      expect(recorded.rule.action.parameters.branch).to.be.a.number;
      expect(recorded.rule.action.parameters.branch).to.equal(24);
      done();
    }));

    $scope.$digest();
    $httpBackend.flush();
  });

  it('should pass product predicates to getActionsList() if mode=product', function(done) {
    $httpBackend.expectPOST('/admin/rules/actions', {
      predicates: [{
        id: 'productEquals',
        parameters: { product: 'Firefox' }
      }]
    }).respond({});
    $httpBackend.expectPOST('/admin/rules').respond(404);
    $rootScope.product = 'Firefox';

    var $scope = $rootScope.$new();

    $compile('<div data-upgrade-action data-product="product" data-target-mode="product"></div>')($scope);
    $scope.$digest();
    $scope.$on('onRESTComplete', function() {
      done();
    });
    $httpBackend.flush();
  });

  it('should pass extension predicates to getActionsList() if mode=extension', function(done) {
    $httpBackend.expectPOST('/admin/rules/actions', {
      predicates: [{
        id: 'extProductEquals',
        parameters: { product: 'Firefox' }
      }, {
        id: 'extIdEquals',
        parameters: { id: 'myExtensionId' }
      }]
    }).respond({});
    $httpBackend.expectPOST('/admin/rules').respond(404);
    $rootScope.product = 'Firefox';

    var $scope = $rootScope.$new();

    $compile('<div data-upgrade-action data-product="product" data-target-id="myExtensionId" data-target-mode="extension"></div>')($scope);
    $scope.$digest();
    $scope.$on('onRESTComplete', function() {
      done();
    });
    $httpBackend.flush();
  });

  function mockrulesAction() {
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
            description: 'Mozilla product major version number (i.e. \"17\")',
            type: 'number',
            mandatory: true,
            defaultValue: 3
          }
        ]
      }
    };
  }

  function mockFindByPredicate() {
    return {
      _id: '526971f012b9b47610000002',
      predicates: [
        {
          id: 'productEquals',
          parameters: {
            product: 'Firefox'
          }
        }
      ],
      action: {
        id: 'deny',
        parameters: {}
      }
    };
  }

});
