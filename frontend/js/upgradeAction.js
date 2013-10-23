"use strict";

(function() {

function getAction(actionList, actionId) {
  return ( actionId in actionList ) ? actionList[actionId] : null;
};
function getParameter(action, parameterId) {
  if ( ! ("parametersDefinitions" in action) ) {
    return ;
  }
  for (var i=0; i<action.parametersDefinitions.length; i++) {
    if ( action.parametersDefinitions[i].id == parameterId ) {
      return action.parametersDefinitions[i];
    }
  }
};

function fillParameters(parameters, action) {
  var back = action.parametersDefinitions.map(function(param) {
    var newparam = angular.copy(param);
    if (newparam.id in parameters) {
      newparam.value = parameters[newparam.id];
    }
    return newparam;
  });
  return back;
};

angular.module("mupeeUpgradeAction", [])
.directive("upgradeAction", ["actionListDisplay", "actionAPI", '$q', 'inheritedAction',
           function(actionListDisplay, actionAPI, $q, inheritedAction) {
  
  function setDefaultsFromRule($scope, actualRule, actionList) {
    $scope.activeAction = actualRule.action ? actualRule.action : inheritedAction;
    $scope.actualRuleId = actualRule._id ? actualRule._id : 0;
    $scope.activeActionSummary = actionListDisplay(getAction(actionList, $scope.activeAction.id), $scope.activeAction);
  };
  
  function controller($scope, $element, $attrs) {
    $scope.modes = {
      LOAD: "load",
      RECORD: "record",
      DISPLAY: "display",
      EDIT: "edit"
    };
    $scope.mode = $scope.modes.LOAD;

    $q.all([actionAPI.getActionList(), actionAPI.getRule($scope.targetProduct, $scope.targetVersion)])
    .then(function(promisesResults) {
      var upgradeActionList = promisesResults[0];
      var actualRule = promisesResults[1];
      $scope.mode = $scope.modes.DISPLAY;
      $scope.upgradeActionList = angular.copy(upgradeActionList);
      setDefaultsFromRule($scope, actualRule, $scope.upgradeActionList);
    });
    
    $scope.startEdition = function() {
      $scope.mode = $scope.modes.EDIT;
      var actionDef = getAction($scope.upgradeActionList, $scope.activeAction.id);
      $scope.edition = {
        activeActionId: $scope.activeAction.id,
        parameters: $scope.activeAction.parameters ? fillParameters($scope.activeAction.parameters, actionDef):[]
      };
    };
    
    $scope.updateSelectedForm = function() {
      var action = getAction($scope.upgradeActionList, $scope.edition.activeActionId);
      if ( $scope.edition.activeActionId === $scope.activeAction.id ) {
        $scope.edition.parameters = fillParameters($scope.activeAction.parameters, action);
      } else if ( action.parametersDefinitions ) {
        $scope.edition.parameters = action.parametersDefinitions;
      } else {
        $scope.edition.parameters = [];
      }
    };
    
    $scope.submitForm = function() {
      console.log("submit: ",$scope.edition);
      $scope.mode = $scope.modes.RECORD;
      var ruleJSON = actionAPI.buildRuleJSON(
        $scope.targetProduct,
        $scope.actualRuleId, 
        $scope.edition,
        $scope.targetVersion
      );
      actionAPI.recordRule(ruleJSON).then(function(data) {
        setDefaultsFromRule($scope, data, $scope.upgradeActionList);
        $scope.mode = $scope.modes.DISPLAY;
      });
    };
  };
  
  var directive = {
    restrict: 'A',
    replace: true,
    scope: {
      "targetProduct": "=product",
      "targetVersion": "=version"
    },
    templateUrl: 'directives/upgradeAction',
    controller: ["$scope", "$element", "$attrs", controller]
  };
  
  return directive;
  
}])
.factory("actionAPI", ['$http','$q',function($http,$q) {
  
  function buildPredicates(product, version) {
    var predicates = [
      {
        id: 'productEquals',
        parameters: {product: product}
      }
    ];
    
    if ( version && version != '*' ) {
      predicates.push({
        id: "branchEquals",
        parameters: {branch: parseInt(version.majorVersion,10)}
      });
    }
    return predicates;
  };
  
  function getRule(product, version) {
    var query = {predicates: buildPredicates(product, version)};
    
    var deferred = $q.defer();
    $http.post("/admin/rules", query, {
      headers: { 'X-http-method-override': 'GET' }
    })
    .success(function(data) { deferred.resolve(data); })
    .error(function(data,status) {
      if ( status == 404 ) { return deferred.resolve({}); }
      deferred.reject(status, data); 
    });
    return deferred.promise;
  };
  
  function getActionList() {
    var deferred = $q.defer();
    $http.get("/admin/rules/actions")
    .success(function(data) { deferred.resolve(data); })
    .error(function(data,status) { deferred.reject(status, data); });
    return deferred.promise;
  };
  
  function postRule(data) {
    var deferred = $q.defer();
    $http.post("/admin/rules",data)
    .success(function(data) { deferred.resolve(data); })
    .error(function(data,status) { deferred.reject(status, data); });
    return deferred.promise;
  };
  
  function putRule(data) {
    var deferred = $q.defer();
    $http.put("/admin/rules/"+encodeURIComponent(data.rule._id),data)
    .success(function(data) { deferred.resolve(data); })
    .error(function(data,status) { deferred.reject(status, data); });
    return deferred.promise;
  };
  
  function deleteRule(data) {
    var deferred = $q.defer();
    $http.delete("/admin/rules",data)
    .success(function(data) { deferred.resolve(data); })
    .error(function(data,status) { deferred.reject(status, data); });
    return deferred.promise;
  };
  
  function recordRule(data) {
    if ( !data.rule._id ) {
      return postRule(data);
    }
    if ( data.rule.action.id === 0 ) {
      return deleteRule(data);
    }
    return putRule(data);
  };
  
  function buildRuleJSON (product, ruleId, action, version) {
    var ruleData = {
      predicates: buildPredicates(product, version),
      action: {
        id: action.activeActionId,
        parameters: {}
      }
    };

    for (var i = 0; i < action.parameters.length; i++) {
      var p = action.parameters[i];
      ruleData.action.parameters[p.id] = p.value;
    }
    if ( ruleId ) { ruleData._id = ruleId; }

    return {rule: ruleData};
  };
  
  return {
    getRule: getRule,
    getActionList: getActionList,
    recordRule: recordRule,
    buildRuleJSON: buildRuleJSON
  };
  
}])
.factory("actionListDisplay", function() {
  function getParametersDisplay(action, parameters) {
    if ( !parameters  ) {
      return "";
    }
    
    var keys = Object.keys(parameters);
    var displayParameters = [];
    keys.forEach(function(k) {
      var parameterDef = getParameter(action, k);
      if ( !parameterDef ) {
        return ;
      }
      displayParameters.push(parameterDef.summary+": "+parameters[k]);
    });
    if ( displayParameters.length ) {
      return " ("+displayParameters.join(", ")+")";
    }
    return "";
  };
  
  return function(actionDefinition, currentAction) {
    var display = "";
    if ( !actionDefinition ) {
      return display;
    }
    var parameters = currentAction.parameters || [];
    display=actionDefinition.summary;
    display+=getParametersDisplay(actionDefinition, parameters);
    return display;
  };
})
.value("inheritedAction", {
  id: 0,
  summary: "use defaults",
  description: "no specific policy was targeted for this version or IP range.",
  parameters: []
});

})();