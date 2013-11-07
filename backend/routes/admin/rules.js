'use strict';

var Rule = require('../../rules/rule');
var rulesValidation = require('../../rules/validation');
var engine = require('../../rules/engine');

function getRuleFromRequest(request, response) {
  if (!request.body || !request.body.rule) {
    response.send(400, 'body should contain a rule object');
    return false;
  }
  var rule = request.body.rule;

  try {
    rulesValidation.validateRuleObject(rule);
  } catch (e) {
    response.send(400, e.message);
    return false;
  }

  return new Rule(rule);
}

function getPredicatesFromRequest(request, response) {
  if (!request.body || !request.body.predicates || !('forEach' in request.body.predicates)) {
    response.send(400, 'body should contain a \'predicates\' array');
    return false;
  }

  var predicates = [];

  for (var i in request.body.predicates) {
    var predicate = request.body.predicates[i];

    try {
      rulesValidation.validatePredicateObject(predicate);
    } catch (e) {
      response.send(400, e.message);
      return false;
    }
    predicates.push(predicate);
  }

  if (!predicates || !predicates.length) {
    response.send(400);
    return false;
  }

  return predicates;
}

exports.listActions = function(request, response) {
  var predicates = getPredicatesFromRequest(request, response);

  if (!predicates) {
    return;
  }

  var actions = engine.listActions(), filteredActions = {};

  for (var id in actions) {
    if (actions[id].isCompatibleWithPredicates(predicates)) {
      filteredActions[id] = actions[id];
    }
  }

  response.json(filteredActions);
};

exports.findByPredicate = function(request, response) {
  var predicates = getPredicatesFromRequest(request, response);

  if (!predicates) {
    return;
  }

  engine.findByPredicate(predicates, function(err, result) {
    if (err) {
      return response.send(500, ('message' in err) ? err.message : err);
    }
    response.send(result ? result : 404);
  });
};

exports.create = function(request, response) {
  var rule = getRuleFromRequest(request, response);
  if (!rule) {
    return;
  }

  engine.create(rule, function(err, result) {
    if (err) {
      return response.send(500, err);
    }
    response.send(result);
  });
};

exports.update = function(request, response) {
  var rule = getRuleFromRequest(request, response);

  if (!rule) {
    return;
  }

  engine.update(rule, function(err, result) {
    if (err) {
      return response.send(500, err);
    }
    response.send(result ? result : 404);
  });
};



exports.delete = function(request, response) {
  var id = request.params.id;

  engine.remove(id, function(err, result) {
    if (err) {
      return response.send(500, err);
    }

    response.send(result ? 200 : 404);
  });
};
