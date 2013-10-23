'use strict';

var db = require('../../mongo-provider');
var Engine = require('../../rules/engine');
var Rule = require('../../rules/rule');
var rulesValidation = require("../../rules/validation");
var engine = new Engine(db);

function getRuleFromRequest(request, response) {
  if (!request.body || !request.body.rule) {
    response.send(400, "body should contain a rule object");
    return false;
  }
  var rule = request.body.rule;
  
  try {
    rulesValidation.validateRuleObject(rule);
  } catch (e) {
    response.send(400, e.message);
    return false;
  }
  return rule;
};

exports.listActions = function(request, response) {
  response.json(engine.listActions());
};

exports.findByPredicate = function(request, response) {
  if (!request.body || !request.body.predicates || !("forEach" in request.body.predicates) ) {
    return response.send(400, "body should contain a 'predicates' array");
  }
  var predicates = []
  for (var i in request.body.predicates ) {
    var predicate = request.body.predicates[i];
    try {
      rulesValidation.validatePredicateObject(predicate);
    } catch(e) {
      return response.send(400, e.message);
    }
    predicates.push(predicate);
  }
  
  if (!predicates || !predicates.length) {
    return response.send(400);
  }

  engine.findByPredicate(predicates, function(err, result) {
    if (err) {
      return response.send(500, ("message" in err) ? err.message : err );
    }
    response.send(result ? result : 404);
  });
};

exports.create = function(request, response) {
  var rule = getRuleFromRequest(request, response);
  if ( !rule ) {
    return ;
  }
  
  engine.create(rule, function(err, result) {
    if (err) {
      return response.send(500, err);
    }
    response.send(result);
  });
};

exports.update = function(request, response) {
  var id = request.params.id;
  
  var rule = getRuleFromRequest(request, response);
  if ( !rule ) {
    return ;
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

  engine.delete(id, function(err, result) {
    if (err) {
      return response.send(500, err);
    }

    response.send(result ? 200 : 404);
  });
};
