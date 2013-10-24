'use strict';

angular.module('mupeeAPI', [])
.factory('API', ['$http', '$q', function($http, $q) {

  function findRuleByPredicates(predicates) {
    var query = {predicates: predicates};

    var deferred = $q.defer();
    $http.post('/admin/rules', query, {
      headers: { 'X-http-method-override': 'GET' }
    })
    .success(function(data) { deferred.resolve(data); })
    .error(function(data, status) {
      if (status === 404) { return deferred.resolve(); }
      deferred.reject(status, data);
    });
    return deferred.promise;
  }

  function getActionList() {
    var deferred = $q.defer();
    $http.get('/admin/rules/actions')
    .success(function(data) { deferred.resolve(data); })
    .error(function(data, status) { deferred.reject(status, data); });
    return deferred.promise;
  }

  function postRule(rule) {
    var deferred = $q.defer();
    $http.post('/admin/rules', {rule: rule})
    .success(function(data) { deferred.resolve(data); })
    .error(function(data, status) { deferred.reject(status, data); });
    return deferred.promise;
  }

  function putRule(rule) {
    var deferred = $q.defer();
    $http.put('/admin/rules/' + encodeURIComponent(rule._id), {rule: rule})
    .success(function(data) { deferred.resolve(data); })
    .error(function(data, status) { deferred.reject(status, data); });
    return deferred.promise;
  }

  function deleteRule(rule) {
    var deferred = $q.defer();
    $http.delete('/admin/rules/' + rule._id)
    .success(function(data) { deferred.resolve(data); })
    .error(function(data, status) { deferred.reject(status, data); });
    return deferred.promise;
  }

  function recordRule(rule) {
    if (!rule._id) {
      return postRule(rule);
    }
    if (!rule.action || !rule.action.id) {
      return deleteRule(rule);
    }
    return putRule(rule);
  }



  return {
    action: {
      list: getActionList
    },
    rule: {
      record: recordRule,
      findByPredicate: findRuleByPredicates
    }
  };
}])
.factory('buildPredicate', function() {
  return function buildPredicate(id, parameters) {
    return {
      id: id,
      parameters: parameters
    };
  };
});
