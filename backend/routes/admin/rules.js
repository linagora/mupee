'use strict';

var engine = new (require('../../rules-engine'));

exports.listActions = function(request, response) {
  response.json(engine.listActions());
};

exports.findByPredicate = function(request, response) {
  var predicate = predicateFromRequest(request);

  if (!predicate) {
    return response.send(400);
  }

  engine.findByPredicate(predicate, function(err, result) {
    if (err) {
      return response.send(500, err);
    }

    response.send(result || 404);
  });
};

exports.create = function(request, response) {
  var rule = ruleFromRequest(request);

  if (!rule) {
    return response.send(400);
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
  var rule = ruleFromRequest(request);

  if (!rule) {
    return response.send(400);
  }

  engine.update(id, rule, function(err, result) {
    if (err) {
      return response.send(500, err);
    }

    response.send(result || 404);
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

/**
{
  id: 'branchAndProductEqual',
  parameters: [
    {
      id: 'branch',
      value: '17'
    },
    {
      id: 'product',
      value: 'Thunderbird'
    }
  ]
}
 *
 * @param request The HTTP request
 * 
 * @returns PredicateDefinition
 */
function predicateFromRequest(request) {
  return request.body.predicate;
}

/**
{
  id: 'rule-id',
  predicate: {
    id: 'productEquals',
    parameters: [
      {
        id: 'product',
        value: 'Thunderbird'
      }
    ]
  },
  action: {
    id: 'action3',
    parameters: [
      {
        id: 'branch',
        value: '24'
      }
    ]
  }
}
 * 
 * @param request The HTTP request
 * 
 * @returns RuleDefinition
 */
function ruleFromRequest(request) {
  return request.body.rule;
}