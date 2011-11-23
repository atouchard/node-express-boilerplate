
var fs = require('fs');

/**
 * TEST Environment settings
 */

module.exports = function(app, express) {
  app.use(express.profiler());
  app.use(express.logger({ format: 'tiny', stream: fs.createWriteStream('logs/node.log') }));
  app.set('db-uri', 'mongodb://localhost/openbox-test');
  app.set('view options', { layout: 'layouts/default' });
  app.use(express.errorHandler());
};