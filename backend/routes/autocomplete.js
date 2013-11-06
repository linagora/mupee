'use strict';

var db = require('../mongo-provider'),
    UpdateStorage = require('../../backend/update-storage'),
    Extension = require('../extension').Extension,
    ExtensionStorage = require('../../backend/extension-storage'),
    flatten = require('flat').flatten,
    productMapper = require('../product-mapper');

function sendValues(response, result, property) {
  var values = result.map(function (value) {
    return flatten(value)[property];
  });
  return response.send(values);
}

function sendAutoCompleteValuesForProduct(response, product, property) {
  var storage = new UpdateStorage(db);
  storage.findAll({product: product}, function(err, result) {
    if (!result) {
      return response.send([]);
    }
    sendValues(response, result, property);
  });
}

function sendAutoCompleteValuesForExtension(response, id, product, version, property) {
  var extensionStorage = new ExtensionStorage(db);
  extensionStorage.findByExtension({id: id}, function(err, result) {
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
      targetMode = request.query.targetMode;

  if (targetMode === 'product') {
    sendAutoCompleteValuesForProduct(response, product, property);
  } else if (targetMode === 'extension') {
    sendAutoCompleteValuesForExtension(response, id, product, version, property);
  } else {
    return response.send([]);
  }
};
