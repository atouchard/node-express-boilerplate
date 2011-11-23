
/**
 * DEVELOPMENT Environment settings
 */

module.exports = function(app, express) {
  app.use(express.logger({ format: 'dev' }));
  app.set('db-uri', 'mongodb://localhost/openbox-development');
  app.set('view options', { layout: 'layouts/default', pretty: true });
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
};