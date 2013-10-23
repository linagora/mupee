'use strict';

var db = require('../../mongo-provider');
var Engine = require('../../rules/engine');

var engine = new Engine(db);

exports.listActions = function(request, response) {
  response.json(engine.listActions());
};

exports.findByPredicate = function(request, response) {
  var predicate;

  if (request.body && request.body.predicate) {
    predicate = toServerRuleComponent(request.body.predicate);
  }

  if (!predicate) {
    return response.send(400);
  }

  engine.findByPredicate(predicate, function(err, result) {
    if (err) {
      return response.send(500, err);
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

  if (request.body && request.body.rule) {
    rule = toServerRule(request.body.rule);
  }

  if (!rule) {
    return response.send(400);
  }

  engine.update(id, rule, function(err, result) {
    if (err) {
      return response.send(500, err);
    }

    response.send(result ? toClientRule(result) : 404);
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
    predicate : clientRule.predicate ? toServerRuleComponent(clientRule.predicate) : undefined,
    action : clientRule.action ? toServerRuleComponent(clientRule.action) : undefined
  };
}

function toClientRule(serverRule) {
  return {
    id : serverRule._id,
    summary : serverRule.summary,
    description : serverRule.description,
    predicate : toClientRuleComponent(serverRule.predicate),
    action : toClientRuleComponent(serverRule.action)
  }
}

