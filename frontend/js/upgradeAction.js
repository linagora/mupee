'use strict';

(function() {

  function getParameter(action, parameterId) {
    if (! ('parametersDefinitions' in action)) {
      return;
    }
    for (var i = 0; i < action.parametersDefinitions.length; i++) {
      if (action.parametersDefinitions[i].id === parameterId) {
        return action.parametersDefinitions[i];
      }
    }
  }

  function fillParameters(parameters, action) {
    var back = action.parametersDefinitions.map(function(param) {
      var newparam = angular.copy(param);
      if (newparam.id in parameters) {
        newparam.value = parameters[newparam.id];
      }
      return newparam;
    });
    return back;
  }

  angular.module('mupeeUpgradeAction', ['mupeeAPI'])
  .directive('upgradeAction', ['actionListDisplay', 'API', '$q', 'inheritedAction',
             'buildRuleJSON', 'productAndVersionPredicates',
            function(actionListDisplay, API, $q, inheritedAction, buildRuleJSON,
                     productAndVersionPredicates) {

    function controller($scope) {
      $scope.modes = {
        LOAD: 'load',
        RECORD: 'record',
        DISPLAY: 'display',
        EDIT: 'edit'
      };
      $scope.mode = $scope.modes.LOAD;

      $q.all(
        [
          API.action.list(),
          API.rule.findByPredicate(productAndVersionPredicates($scope.targetProduct, $scope.targetVersion))
        ]
      )
      .then(
        function(promisesResults) {
          var upgradeActionList = promisesResults[0];
          var actualRule = promisesResults[1];
          if (!actualRule) {
            actualRule = {_id: 0, action: inheritedAction, parameters: {}};
          }
          $scope.mode = $scope.modes.DISPLAY;
          $scope.upgradeActionList = angular.copy(upgradeActionList);
          if ($scope.targetVersion) {
            $scope.upgradeActionList[inheritedAction.id] = inheritedAction;
          }
          setDefaultsFromRule(actualRule);
        }
      );

      $scope.startEdition = function() {
        $scope.mode = $scope.modes.EDIT;
        var actionDef = getAction($scope.activeAction.id);
        $scope.edition = {
          activeActionId: $scope.activeAction.id,
          parameters: $scope.activeAction.parameters ? fillParameters($scope.activeAction.parameters, actionDef) : []
        };
      };

      $scope.updateSelectedForm = function() {
        var action = getAction($scope.edition.activeActionId);
        if ($scope.edition.activeActionId === $scope.activeAction.id) {
          $scope.edition.parameters = fillParameters($scope.activeAction.parameters, action);
        } else if (action.parametersDefinitions) {
          $scope.edition.parameters = action.parametersDefinitions;
        } else {
          $scope.edition.parameters = [];
        }
      };

      $scope.submitForm = function() {
        console.log('submit: ', $scope.edition);
        $scope.mode = $scope.modes.RECORD;
        if ($scope.edition.activeActionId === $scope.activeAction.id &&
          $scope.edition.activeActionId === inheritedAction.id) {
          //noop
          $scope.mode = $scope.modes.DISPLAY;
          return;
        }

        var ruleJSON = buildRuleJSON(
          $scope.targetProduct,
          $scope.actualRuleId,
          $scope.edition,
          $scope.targetVersion
        );
        API.rule.record(ruleJSON).then(function(data) {
          setDefaultsFromRule(data);
          $scope.mode = $scope.modes.DISPLAY;
        });
      };

      function getAction(actionId) {
        return (actionId in $scope.upgradeActionList) ? $scope.upgradeActionList[actionId] : null;
      }

      function setDefaultsFromRule(actualRule) {
        $scope.activeAction = actualRule.action ? actualRule.action : inheritedAction;
        $scope.actualRuleId = actualRule._id ? actualRule._id : 0;
        $scope.activeActionSummary = actionListDisplay(getAction($scope.activeAction.id), $scope.activeAction);
      }
    }

    var directive = {
      restrict: 'A',
      replace: true,
      scope: {
        'targetProduct': '=product',
        'targetVersion': '=version'
      },
      templateUrl: 'directives/upgradeAction',
      controller: ['$scope', controller]
    };

    return directive;

  }])

  .factory('buildRuleJSON', ['inheritedAction', 'productAndVersionPredicates',
           function(inheritedAction, productAndVersionPredicates) {
    function buildRuleJSON(product, ruleId, action, version) {
      var predicates = productAndVersionPredicates(product, version);
      var ruleData = {
        predicates: predicates,
        action: {
          id: action.activeActionId,
          parameters: {}
        }
      };

      if (action.activeActionId === inheritedAction.id) {
        ruleData.action.id = null;
      }

      for (var i = 0; i < action.parameters.length; i++) {
        var p = action.parameters[i];
        ruleData.action.parameters[p.id] = p.value;
      }
      if (ruleId) { ruleData._id = ruleId; }

      return ruleData;
    }
    return buildRuleJSON;
  }])

  .factory('actionListDisplay', function() {
    function getParametersDisplay(action, parameters) {
      if (!parameters) {
        return '';
      }

      var keys = Object.keys(parameters);
      var displayParameters = [];
      keys.forEach(function(k) {
        var parameterDef = getParameter(action, k);
        if (!parameterDef) {
          return;
        }
        displayParameters.push(parameterDef.summary + ': ' + parameters[k]);
      });
      if (displayParameters.length) {
        return ' (' + displayParameters.join(', ') + ')';
      }
      return '';
    }

    return function(actionDefinition, currentAction) {
      var display = '';
      if (!actionDefinition) {
        return display;
      }
      var parameters = currentAction.parameters || [];
      display = actionDefinition.summary;
      display += getParametersDisplay(actionDefinition, parameters);
      return display;
    };
  })

  .factory('productAndVersionPredicates', ['buildPredicate', function(buildPredicate) {
    return function productAndVersionPredicates(product, version) {
      var predicates = [buildPredicate('productEquals', {product: product})];
      if (version) {
        predicates.push(buildPredicate('branchEquals', {branch: parseInt(version, 10)}));
      }
      return predicates;
    };
  }])

  .value('inheritedAction', {
    id: '_inherited',
    summary: 'use defaults',
    description: 'no specific policy was targeted for this version or IP range.',
    parametersDefinitions: []
  });

})();
