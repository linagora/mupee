'use strict';

var express = require('express'),
    http = require('http'),
    path = require('path');

var proxy = require('./backend/routes/updates'),
    admin = require('./backend/routes/admin'),
    routes = require('./backend/routes'),
    config = require('./backend/config'),
    logger = require('./backend/logger'),
    passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy;

var app = exports.modules = express();

passport.use(new BasicStrategy(require('./backend/auth/' + config.interface.authModule)));
app.use(passport.initialize());

app.set('views', __dirname + '/frontend/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', passport.authenticate('basic'), routes.index);
app.get('/:name', passport.authenticate('basic'), routes.index);
app.get('/partials/:name', passport.authenticate('basic'), routes.partials);

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

app.get('/admin/versions', passport.authenticate('basic'), admin.findAll);
app.get('/admin/versions/:id', passport.authenticate('basic'), admin.findOne);

http.createServer(app).listen(app.get('port'), function() {
  logger.info('mozilla-updater server listening on port %d', app.get('port'));
});
