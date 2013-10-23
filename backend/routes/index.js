'use strict';

exports.index = function(req, res) {
  res.render('index');
};

exports.partials = function(req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};

exports.directives = function (req, res) {
  var name = req.params.name;
  res.render('directives/' + name);
};

