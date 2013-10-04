'use strict';

var express = require('express'),
    http = require('http'),
    path = require('path');

var proxy = require('./routes/updates'),
    config = require('./lib/config'),
    logger = require('./lib/logger');

var app = express();

app.use(express.logger({
  stream: {
    write: function (str) {
      logger.debug(str);
    }
  }
}));

app.get('/update/3/:product/:version/:build_id/:build_target/:locale/:channel/:os_version' +
        '/:distribution/:distribution_version/update.xml', proxy.updateClient);
app.get('/update/3/*', proxy.emptyUpdates);
app.use('/download', express.static(config.download.dir));

logger.info('Dumping server configuration :', config);
app.set('port', config.server.port);

app.put('/admin/updates/:id/update/:indexOfUpdate', admin.activateUpdate);
app.delete('/admin/updates/:id/update/:indexOfUpdate', admin.deactivateUpdate);

http.createServer(app).listen(app.get('port'), function() {
  logger.info('mozilla-updater server listening on port %d', app.get('port'));
});
