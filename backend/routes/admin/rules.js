'use strict';

var db = require('../../mongo-provider');
var Engine = require('../../rules/engine');
var Rule = require('../../rules/rule');
var rulesValidation = require("../../rules/validation");
var engine = new Engine(db);

exports.listActions = function(request, response) {
  response.json(engine.listActions());
};

exports.findByPredicate = function(request, response) {
  if (!request.body || !request.body.predicates || !("forEach" in request.body.predicates) ) {
    return response.send(400, "body should contain a 'predicates' array");
  }
  var predicates = []
  for (var i in request.body.predicates ) {
    var predicate = toServerRuleComponent(request.body.predicates[i]);
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

    response.send(result ? toClientRule(result) : 404);
  });
};

exports.create = function(request, response) {
  var rule;

  if (request.body && request.body.rule) {
    rule = toServerRule(request.body.rule);
  }

  if (!rule) {
    return response.send(400);
  }

  engine.create(rule, function(err, result) {
    if (err) {
      return response.send(500, err);
    }

    response.send(toClientRule(result));
  });
};

exports.update = function(request, response) {
  var id = request.params.id;
  var rule;

  if (!request.body || !request.body.rule) {
    return response.send(400, "body should contain a rule object");
  }
  var rule = toServerRule(request.body.rule);
  
  try {
    rulesValidation.validateRuleObject(rule);
  } catch (e) {
    return response.send(400, e.message);
  }
  
  delete rule._id;
  engine.update(id, rule, function(err, result) {
    if (err) {
      return response.send(500, err);
    }
    rule._id = id;
    response.send(result ? toClientRule(rule) : 404);
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

function toServerParameters(clientParameters) {
  var serverParameters = {};

  if (clientParameters) {
    clientParameters.forEach(function(parameter) {
      serverParameters[parameter.id] = parameter.value;
    });
  }
  return serverParameters;
}

function toClientParameters(serverParameters) {
  var clientParameters = [];

  Object.keys(serverParameters).forEach(function(id) {
    clientParameters.push({
      id : id,
      value : serverParameters[id]
    });
  });
  return clientParameters;
}

function toServerRuleComponent(clientRuleComponent) {
  var serverRuleComponent;

  if (clientRuleComponent.id) {
    serverRuleComponent = {};
    serverRuleComponent.id = clientRuleComponent.id;
    serverRuleComponent.parameters = toServerParameters(clientRuleComponent.parameters);
  }
  return serverRuleComponent;
}

function toClientRuleComponent(serverRuleComponent) {
  var clientRuleComponent = {};

  clientRuleComponent.id = serverRuleComponent.id;
  clientRuleComponent.parameters = toClientParameters(serverRuleComponent.parameters);
  return clientRuleComponent;
}

function toServerRule(clientRule) {
  return {
    _id : clientRule.id,
    summary : clientRule.summary,
    description : clientRule.description,
    predicates : clientRule.predicates ? clientRule.predicates.map(function(predicate) { return toServerRuleComponent(predicate); }) : undefined,
    action : clientRule.action ? toServerRuleComponent(clientRule.action) : undefined
  };
}

function toClientRule(serverRule) {
  return {
    id : serverRule._id,
    summary : serverRule.summary,
    description : serverRule.description,
    predicates : serverRule.predicates.map(function(predicate) {      return toClientRuleComponent(predicate)    }),
    action : toClientRuleComponent(serverRule.action)
  }
}

