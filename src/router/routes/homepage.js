const renderer = require('../../js/renderer/nunjucks-renderer').default();
const utils = require('./utils');

const buildModel = (req, res, next) => {
  res.locals.render = {};
  res.locals.render.auth_list = res.locals.authList;

  next();
};

const renderResponse = (req, res, next) => {
  res.contentType = 'text/html';
  res.header('content-type', 'text-html');
  res.send(200, renderer.render('pages/homepage.njk', {
    ...res.nunjucks,
    ...res.locals.render,
  }));

  next();
};

module.exports = (server) => {
  server.get(
    '/',
    utils.isUserRegistered,
    utils.getAuths,
    buildModel,
    renderResponse,
  );
};
