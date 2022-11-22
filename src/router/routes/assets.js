const path = require('path');
const restify = require('restify');

/**
 * Load in all the static files and assets as items that are going to be
 * hosted on an endpoint for the web service to reach and consume as
 * required.
 *
 * @param {object} server - The server object that we're fleshing out over
 * time.
 */
module.exports = (server) => {
  server.get('/assets/fonts/*', restify.plugins.serveStaticFiles(path.join(process.cwd(), 'public/fonts/')));
  server.get('/assets/images/*', restify.plugins.serveStaticFiles(path.join(process.cwd(), 'public/images/')));
  server.get('/assets/javascript/*', restify.plugins.serveStaticFiles(path.join(process.cwd(), 'public/javascript/')));
  server.get('/assets/stylesheets/*', restify.plugins.serveStaticFiles(path.join(process.cwd(), 'public/stylesheets/')));
  server.get('/assets/components/*', restify.plugins.serveStaticFiles(path.join(process.cwd(), 'public/components/')));
};
