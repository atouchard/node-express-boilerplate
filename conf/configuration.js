
/**
 * Default configuration manager
 * Inject app and express reference
 */

module.exports = function(app, express) {

  // -- DEVELOPMENT
  app.configure('development', function() {
    require("./development")(app, express);
  });

  // -- TEST
  app.configure('test', function() {
    require("./test")(app, express);
  });

  // -- PRODUCTION
  app.configure('production', function() {
    require("./production")(app, express);
  });
};

// -- Global settings
var settings = {
  'siteName' : 'yoursitename',
  'sessionSecret' : 'sessionSecret',
  'uri' : 'http://localhost', // Without trailing /
  'port' : process.env.PORT || 8001,
  'debug' : 0,
  'profile' : 0
};

module.exports.settings = settings;