'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The upgradeAction Angular directive', function(done) {
  var $compile, $rootScope, $httpBackend;

  beforeEach(module('mupeeUpgradeAction', 'directives/upgradeAction'));
  beforeEach(inject(
    ['$compile', '$rootScope', '$httpBackend', function($c, $r, $h) {
      $compile = $c;
      $rootScope = $r;
      $httpBackend = $h;
    }]
  ));

  it('should emit onRESTComplete event when it is done querying the backend', function() {
    $httpBackend.expectGET('/admin/rules/actions').respond({});
    $httpBackend.expectPOST('/admin/rules').respond(404);
    $rootScope.product = 'Firefox';

    var $scope = $rootScope.$new();

    $compile('<div data-upgrade-action data-product="product" data-version="version"></div>')($scope);
    $scope.$digest();
    $scope.$on('onRESTComplete', function() {
      done();
    });
  });

  it('should load data from the server for a product', function() {
    $httpBackend.expectGET('/admin/rules/actions').respond(mockrulesAction());
    $httpBackend.expectPOST('/admin/rules').respond(mockFindByPredicate());
    $rootScope.product = 'Firefox';

    var $scope = $rootScope.$new();
    var element = $compile('<div data-upgrade-action data-product="product" data-version="version"></div>')($scope);

    $scope.$digest();
    $scope.$on('onRESTComplete', function() {
      var editButton = element.find('[data-ng-click="startEdition()"]'),
      displayContainer = element.children('[data-ng-show*="DISPLAY"]'),
      editionContainer = element.children('[data-ng-show*="EDIT"]');

      expect(editButton.html()).to.equals('deny upgrades <img src="../../images/gear.png" class="edit-icon">');

      editButton.click();
      $scope.$digest();

      expect(displayContainer.hasClass('ng-hide')).to.be.true;
      expect(editionContainer.hasClass('ng-hide')).to.be.false;
      expect(editionContainer.find('option').length).to.equals(2);
      expect(editionContainer.find('option').eq(0).attr('value')).to.equal('deny');
      expect(editionContainer.find('option').eq(0).is(':selected')).to.be.true;
      expect(editionContainer.find('option').eq(1).attr('value')).to.equal('latestForBranch');

      $scope.$digest();

      done();
    });
  });

  it('should load data from the server for a product and a branch', function() {
    $httpBackend.expectGET('/admin/rules/actions').respond(mockrulesAction());
    $httpBackend.expectPOST('/admin/rules').respond(mockFindByPredicate());
    $rootScope.product = 'Firefox';
    $rootScope.version = {majorVersion: 17};

    var $scope = $rootScope.$new();
    var element = $compile('<div data-upgrade-action data-product="product" data-version="version"></div>')($scope);

    $scope.$digest();
    $scope.$on('onRESTComplete', function() {
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
    });
  });

  it('should send correct form data to the server', function() {
    var recorded;

    $httpBackend.expectGET('/admin/rules/actions').respond(mockrulesAction());
    $httpBackend.expectPOST('/admin/rules').respond(mockFindByPredicate());
    $httpBackend.expectPOST('/admin/rules', function(data) { recorded = data; return true; }).respond(mockFindByPredicate());
    $rootScope.product = 'Firefox';
    $rootScope.version = {majorVersion: 17};

    var $scope = $rootScope.$new();
    var element = $compile('<div data-upgrade-action data-product="product" data-version="version"></div>')($scope);

    $scope.$digest();
    $scope.$on('onRESTcomplete', function() {
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
      expect(editionContainer.find('input[type=string]').length).to.equal(0);

      editionContainer.find('select').val('latestForBranch');
      editionContainer.find('option').eq(0).removeAttr('selected', false);
      editionContainer.find('option').eq(2).attr('selected', 'selected');
      editionContainer.find('select').change();

      $scope.$digest();

      expect(editionContainer.find('input[type=string]').length).to.equal(1);
      expect(editionContainer.find('input[type=string]').attr('placeholder')).to.equal('Version number');

      editionContainer.find('input[type=string]').val('24-beta1').trigger('input');
      $scope.$digest();
      recordButton.click();
      $scope.$digest();

      expect(recorded).to.exist;
      expect(recorded.action).to.exist;
      expect(recorded._id).to.equal('526971f012b9b47610000002');
      expect(recorded.predicates).to.be.an.array;
      expect(recorded.predicates).to.have.length(2);
      expect(recorded.action.parameters.branch).to.equal('24-beta1');

      done();
    });
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
            type: 'string',
            mandatory: true,
            defaultValue: 'minor'
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
