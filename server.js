
// -- Module dependencies.
var express = require('express'),
    routePost = require('./controllers/post'),
    routeUser = require('./controllers/user'),
    logo = require('./lib/logo'),
    mongoose = require('mongoose'),
    connect = require('connect'),
    stylus = require('stylus'),
    jade = require('jade'),
    color = require('colors');

// -- Create Express instance and export
var app = module.exports = express.createServer();

// -- Import configuration
var conf = require('./conf/configuration');
conf(app, express);
var settings = conf.settings;

// -- Boot appplication
require('./boot').boot(app);

// -- Additional module dependencies
require('express-namespace');

//routePost.init(app);

// -- Routes

var custom_middleware = [routeUser.checkSession];

app.all('/*', custom_middleware, function(req, res, next){
  res.locals({
    session : req.currentUser, 
    token : req.session._csrf,
    settings : settings
  });
  next();
});

app.get('/', routePost.index);
app.get('/logout', routeUser.logout);

// -- Profile space
app.namespace('/login', function() {
  app.get('', routeUser.login);
  app.post('', routeUser.connection);
  app.get('/create', routeUser.new);
  app.post('/create', routeUser.create);
});

// -- Article space
app.namespace('/articles', function() {
  app.get('', routePost.all);
  app.post('', routePost.create);
  app.get('/new', routePost.new);
  app.get('/:id', routePost.find);
  app.put('/:id', routePost.set);
  app.get('/:id/edit', routePost.edit);
  app.get('/:id/delete', routePost.remove);
});

app.get('/500', function(req, res, next) {
  next(new Error());
});

app.get('/404', function(req, res, next) {
  next();
});

// Only listen on $ node app.js
if (!module.parent) {

  logo.print();
  app.listen(settings.port);
  console.log('Express server listening on port %d, environment: %s', app.address().port, app.settings.env);
  console.log('Using Express %s, Connect %s, Jade %s, Stylus %s, Mongoose %s', express.version.blue.bold, connect.version.blue.bold, jade.version.blue.bold, stylus.version.blue.bold, mongoose.version.blue.bold);
}
