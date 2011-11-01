
var fs = require('fs');

/**
 * PRODUCTION Environment settings
 */

module.exports = function(app, express) {
  app.use(express.logger({ format: 'tiny', stream: fs.createWriteStream('logs/node.log') }));
  app.set('db-uri', 'mongodb://localhost/openbox');
  app.set('view options', { layout: 'layouts/default' });
  app.use(express.errorHandler());
};