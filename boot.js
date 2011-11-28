
// -- Module dependencies
var express = require('express'),
    RedisStore = require('connect-redis')(express),
    mongoose = require('mongoose'),
    helpers = require('./helpers'),
    settings = require('./conf/configuration').settings;

// -- Global paths
var views = __dirname + '/views',
    static_root = __dirname + '/public',
    docroot = process.cwd() + '/';

/**
 * Express base configuration 
 * Bootstrap
 */
module.exports.boot = function(app) {

  /**
   * Global configuration
   */
  app.configure(function() {

    // -- Define view engine with its options
    app.set('views', views);
    app.set('view engine', 'jade');

    // -- Parses x-www-form-urlencoded request bodies (and json)
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    // -- Cookie support
    app.use(express.cookieParser());

    // -- Set Redis Session
    app.use(express.session({
      secret: settings.sessionSecret,
      store: new RedisStore({ maxAge: 300000 })
    }));

    // -- CRSF protection middleware
    app.use(express.csrf());

    // -- Stylus Middleware
    app.use(require('stylus').middleware({
      src: static_root,
      dest: static_root,
      compress: true,
      warn: true
    }));

    // -- Express routing
    app.use(app.router);

    // -- Static ressources
    app.use(express.staticCache());
    var duration = 2592000000; // One month
    app.use(express.static(static_root, { maxAge: duration }));
    app.use(express.favicon(static_root + '/favicon.ico'));

    // -- 500 status
    app.use(function(err, req, res, next) {
      res.render('500', {
        status: err.status || 500,
        error: err
      });
    });

    // -- 404 status
    app.use(function(req, res, next) {
      res.render('404', {
        status: 404,
        url: req.url
      });
    });

    // -- Dynamic view helpers
    app.dynamicHelpers(helpers.dynamicHelpers);

  });

  // -- Connect to appropriate MongoDB database
  mongoose.connect(app.set('db-uri'));
};
