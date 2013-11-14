'use strict';

var db = require('../mongo-provider'),
    UpdateStorage = require('../../backend/update-storage'),
    Extension = require('../extension').Extension,
    ExtensionStorage = require('../../backend/extension-storage'),
    flatten = require('flat').flatten,
    productMapper = require('../product-mapper');

function sendValues(response, result, property) {
  var values = result.map(function(value) {
    return flatten(value)[property];
  });
  return response.send(values);
}

function sendAutoCompleteValuesForProduct(response, product, property, value) {
  var storage = new UpdateStorage(db);
  var query = {};
  query.product = product;
  query[property] = new RegExp('^' + value);
  storage.findAll(query, function(err, result) {
    if (!result) {
      return response.send([]);
    }
    sendValues(response, result, property);
  });
}

function sendAutoCompleteValuesForExtension(response, id, product, version, property, value) {
  var extensionStorage = new ExtensionStorage(db);
  var query = {};
  query.id = id;
  query[property] = new RegExp('^' + value);
  extensionStorage.findByExtension(query, function(err, result) {
    if (!result) {
      return response.send([]);
    }
    product = productMapper.idFromName(product),
    result = result.filter(function(extension) {
      return (new Extension(extension).getCompatibleTargetApplication(product, version));
    });
    sendValues(response, result, property);
  });
}

exports.getAutoCompleteValues = function(request, response) {
  var id = request.query.id,
      product = request.query.product,
      property = request.query.property,
      version = request.query.version,
      value = request.query.value,
      targetMode = request.query.targetMode;

  if (targetMode === 'product') {
    sendAutoCompleteValuesForProduct(response, product, property, value);
  } else if (targetMode === 'extension') {
    sendAutoCompleteValuesForExtension(response, id, product, version, property, value);
  } else {
    return response.send([]);
  }
};
