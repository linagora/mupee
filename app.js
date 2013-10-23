'use strict';

var express = require('express'),
    http = require('http'),
    path = require('path');

var proxy = require('./backend/routes/updates'),
    versions = require('./backend/routes/admin/versions'),
    rules = require('./backend/routes/admin/rules'),
    routes = require('./backend/routes'),
    config = require('./backend/config'),
    logger = require('./backend/logger'),
    passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy;

var app = exports.modules = express();

app.use(express.logger({
  stream: {
    write: function (str) {
      logger.debug(str);
    }
  }
}));


passport.use(new BasicStrategy(require('./backend/auth/' + config.interface.authModule)));
app.use(passport.initialize());
app.use(express.methodOverride());
app.use(express.json());

app.set('views', __dirname + '/frontend/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', passport.authenticate('basic'), routes.index);
app.get('/:name', passport.authenticate('basic'), routes.index);
app.get('/partials/:name', passport.authenticate('basic'), routes.partials);
app.get('/directives/:name', passport.authenticate('basic'), routes.directives);

app.get('/update/3/:product/:version/:build_id/:build_target/:locale/:channel/:os_version' +
        '/:distribution/:distribution_version/update.xml', proxy.updateClient);
app.get('/update/3/*', proxy.emptyUpdates);
app.use('/download', express.static(config.download.dir));

logger.info('Dumping server configuration :', config);
app.set('port', config.server.port);

app.all('/admin/*', passport.authenticate('basic'));

app.get('/admin/versions', versions.findAll);
app.get('/admin/versions/:id', versions.findOne);

app.post('/admin/rules/', rules.create);
app.get('/admin/rules/', rules.findByPredicate);
app.put('/admin/rules/:id', rules.update);
app.delete('/admin/rules/:id', rules.delete);
app.get('/admin/rules/actions', rules.listActions);

app.get('/:name', routes.index);

http.createServer(app).listen(app.get('port'), function () {
  logger.info('mozilla-updater server listening on port %d', app.get('port'));
});
