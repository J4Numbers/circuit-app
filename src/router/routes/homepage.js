const { Request, Response, Next } = require('restify');
const renderer = require('../../js/renderer/nunjucks-renderer').default();
const utils = require('./utils');

/**
 * Build up a simple object model for use in the view pages - though for
 * the homepage, there isn't that much to show.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
const buildModel = (req, res, next) => {
  res.locals.render = {};
  res.locals.render.auth_list = res.locals.authList;

  next();
};

/**
 * Render the homepage out to the user through nunjucks and the models
 * that we have already built.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
const renderResponse = (req, res, next) => {
  res.contentType = 'text/html';
  res.header('content-type', 'text-html');
  res.send(200, renderer.render('pages/homepage.njk', {
    ...res.nunjucks,
    ...res.locals.render,
  }));

  next();
};

/**
 * Load in the homepage endpoint to the service.
 *
 * @param {object} server - The server object that we're fleshing out over
 * time.
 */
module.exports = (server) => {
  server.get(
    '/',
    utils.isUserRegistered,
    utils.getAuths,
    buildModel,
    renderResponse,
  );
};
