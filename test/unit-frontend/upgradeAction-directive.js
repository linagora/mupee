'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The upgradeAction Angular directive', function() {
  var $q, $compile, $rootScope, $httpBackend, $templateCache;

  beforeEach(angular.mock.module('mupeeUpgradeAction'));

  beforeEach(inject(
    ['$compile', '$rootScope', '$q', '$httpBackend', '$templateCache', function($c, $r, q, $h, $t) {
      $compile = $c;
      $rootScope = $r;
      $q = q;
      $httpBackend = $h;
      $templateCache = $t;
      $t.put('directives/upgradeAction', mockTemplate());
    }]
  ));

  it('should load data from the server for a product', function() {
    var apis = {
    };
    inject(function(API, $q) {
      apis.findByPredicate = API.rule.findByPredicate;
      API.rule.findByPredicate = function() {
        var defered = $q.defer();
        defered.resolve(mockFindByPredicate());
        return defered.promise;
      };

      apis.actionList = API.action.list;
      API.action.list = function() {
        var defered = $q.defer();
        defered.resolve(mockrulesAction());
        return defered.promise;
      };

    });


    $rootScope.product = 'Firefox';

    var element = $compile('<div data-upgrade-action data-product="product" data-version="version"></div>')($rootScope);

    $rootScope.$digest();
    var editButton = element.find('[data-ng-click="startEdition()"]'),
        displayContainer = element.children('[data-ng-show*="DISPLAY"]'),
        editionContainer = element.children('[data-ng-show*="EDIT"]');


    expect(editButton.html()).to.equals('deny upgrades');

    editButton.click();
    $rootScope.$digest();

    expect(displayContainer.hasClass('ng-hide')).to.be.true;
    expect(editionContainer.hasClass('ng-hide')).to.be.false;
    expect(editionContainer.find('option').length).to.equals(2);
    expect(editionContainer.find('option').eq(0).attr('value')).to.equal('deny');
    expect(editionContainer.find('option').eq(0).is(':selected')).to.be.true;
    expect(editionContainer.find('option').eq(1).attr('value')).to.equal('latestForBranch');

    $rootScope.$digest();


    inject(function(API) {
      API.rule.findByPredicate = apis.findByPredicate;
      API.action.list = apis.actionList;
    });
  });

  it('should load data from the server for a product and a branch', function() {
    var apis = {};
    inject(function(API, $q) {
      apis.findByPredicate = API.rule.findByPredicate;
      API.rule.findByPredicate = function() {
        var defered = $q.defer();
        defered.resolve(mockFindByPredicate());
        return defered.promise;
      };

      apis.actionList = API.action.list;
      API.action.list = function() {
        var defered = $q.defer();
        defered.resolve(mockrulesAction());
        return defered.promise;
      };

    });


    $rootScope.product = 'Firefox';
    $rootScope.version = {majorVersion: 17};

    var element = $compile('<div data-upgrade-action data-product="product" data-version="version"></div>')($rootScope);

    $rootScope.$digest();
    var editButton = element.find('[data-ng-click="startEdition()"]'),
        recordButton = element.find('input[type=submit]'),
        displayContainer = element.children('[data-ng-show*="DISPLAY"]'),
        editionContainer = element.children('[data-ng-show*="EDIT"]');


    expect(editButton.html()).to.equals('deny upgrades');
    expect(recordButton.length).to.equals(1);

    editButton.click();
    $rootScope.$digest();
    expect(displayContainer.hasClass('ng-hide')).to.be.true;
    expect(editionContainer.hasClass('ng-hide')).to.be.false;
    expect(editionContainer.find('option').length).to.equals(3);
    expect(editionContainer.find('option').eq(0).attr('value')).to.equal('_inherited');
    expect(editionContainer.find('option').eq(1).attr('value')).to.equal('deny');
    expect(editionContainer.find('option').eq(2).attr('value')).to.equal('latestForBranch');

    inject(function(API) {
      API.rule.findByPredicate = apis.findByPredicate;
      API.action.list = apis.actionList;
    });


  });

  it('should send correct form data to the server', function() {
    var recorded = null;
    var apis = {};
    inject(function(API, $q) {
      apis.findByPredicate = API.rule.findByPredicate;
      API.rule.findByPredicate = function() {
        var defered = $q.defer();
        defered.resolve(mockFindByPredicate());
        return defered.promise;
      };

      apis.actionList = API.action.list;
      API.action.list = function() {
        var defered = $q.defer();
        defered.resolve(mockrulesAction());
        return defered.promise;
      };

      apis.ruleRecord = API.rule.record;
      API.rule.record = function(thing) {
        recorded = thing;
        return {
          then: function() {}
        };
      };

    });


    $rootScope.product = 'Firefox';
    $rootScope.version = {majorVersion: 17};

    var element = $compile('<div data-upgrade-action data-product="product" data-version="version"></div>')($rootScope);

    $rootScope.$digest();
    var editButton = element.find('[data-ng-click="startEdition()"]'),
        recordButton = element.find('input[type=submit]'),
        displayContainer = element.children('[data-ng-show*="DISPLAY"]'),
        editionContainer = element.children('[data-ng-show*="EDIT"]');


    expect(editButton.html()).to.equals('deny upgrades');
    expect(recordButton.length).to.equals(1);

    editButton.click();
    $rootScope.$digest();
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

    $rootScope.$digest();

    expect(editionContainer.find('input[type=string]').length).to.equal(1);
    expect(editionContainer.find('input[type=string]').attr('placeholder')).to.equal('Version number');


    editionContainer.find('input[type=string]').val('24-beta1').trigger('input');
    $rootScope.$digest();
    recordButton.click();
    $rootScope.$digest();

    expect(recorded).to.exist;
    expect(recorded.action).to.exist;
    expect(recorded._id).to.equal('526971f012b9b47610000002');
    expect(recorded.predicates).to.be.an.array;
    expect(recorded.predicates).to.have.length(2);
    expect(recorded.action.parameters.branch).to.equal('24-beta1');

    inject(function(API) {
      API.rule.findByPredicate = apis.findByPredicate;
      API.action.list = apis.actionList;
      API.rule.record = apis.ruleRecord;
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

  function mockTemplate() {
    return '<span><span data-ng-show="mode == modes.DISPLAY"> <span class="hAir">' +
      '<span data-ng-click="startEdition()" class="label">{{activeActionSummary}}</span></span></span>' +
      '<span data-ng-show="mode == modes.LOAD">Loading...</span><span data-ng-show="mode == modes.RECORD">Recording changes...</span>' +
      '<span data-ng-show="mode == modes.EDIT"><div class="small-8 small-centered">' +
      '<form name="actionForm" data-ng-submit="submitForm()">' +
      '<input type="hidden" name="product" value="{{targetProduct}}"><input type="hidden" name="version" value="{{targetVersion}}">' +
      '<fieldset><legend>Edit policy</legend><div class="row">' +
      '<div class="small-8"><div class="row"><div class="small-4 columns"><label for="actionDropDown" class="right inline">Choose the policy : </label></div>' +
      '<div class="small-8 columns"><select id="actionDropDown" name="action" data-ng-model="edition.activeActionId" ' +
      'data-ng-options="a.id as a.summary for (k, a) in upgradeActionList" data-ng-change="updateSelectedForm()"></select></div></div></div></div>' +
      '<div data-ng-repeat="parameter in edition.parameters" data-ng-form="data-ng-form" name="parameterNestedForm">{{parameter.summary}}: <input type="{{parameter.type}}" data-ng-model="parameter.value" data-ng-required="{{parameter.mandatory}}" ' +
      'placeholder="{{parameter.summary}}" class="small-6"/></div><p></p><input type="submit" value="record" data-ng-disabled=""/>' +
      '<button data-ng-click="mode = modes.DISPLAY" class="tiny">cancel</button></fieldset></form></div></span></span>';
  }
});
