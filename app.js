
/**
 * Module dependencies.
 */

var config = require('./lib/config');
var logger = require('./lib/logger');
var express = require('express');
var routes = require('./routes');
var proxy = require('./routes/updates');
var http = require('http');
var path = require('path');

var app = express();

app.get('/update/3/:product/:version/:build_id/:build_target/:locale/:channel/:os_version' +
        '/:distribution/:distribution_version/update.xml', proxy.updateClient);

logger.info('Dumping server configuration :', config);
app.set('port', config.server.port);
http.createServer(app).listen(app.get('port'), function() {
  logger.info('mozilla-updater server listening on port %d', app.get('port'));
});
