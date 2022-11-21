const renderer = require('../../../js/renderer/nunjucks-renderer').default();
const loginCommon = require('./login-common');
const utils = require('../utils');

const startErrors = (req, res, next) => {
  res.locals.errors = {};
  next();
};

const validateLoginDetails = (req, res, next) => {
  const username = req.body['login-name'];
  const password = req.body['login-password'];
  if (username === '') {
    res.locals.errors['login-name'] = 'Please fill in your username';
  }
  if (password === '') {
    res.locals.errors['login-password'] = 'Please fill in your password';
  }

  if (Object.keys(res.locals.errors).length === 0) {
    res.authDetails = {
      username: req.body['login-name'],
      password: req.body['login-password'],
    };
  }
  next();
};

const buildModel = (req, res, next) => {
  res.locals.render = {};
  res.locals.render.auth_list = res.locals.authList;

  next();
};

const renderErrors = (req, res, next) => {
  res.contentType = 'text/html';
  res.header('content-type', 'text-html');
  res.send(200, renderer.render('pages/login.njk', {
    ...res.nunjucks,
    ...res.locals.render,
    errors: res.locals.errors,
  }));
  next();
};

// Internal Login
const renderResponse = async (req, res, next) => {
  res.contentType = 'text/html';
  res.header('content-type', 'text-html');
  res.send(200, renderer.render('pages/login.njk', {
    ...res.nunjucks,
    ...res.locals.render,
  }));
  next();
};

module.exports = (server) => {
  server.get(
    '/login',
    loginCommon.checkUserAlreadyLoggedIn,
    utils.getAuths,
    buildModel,
    renderResponse,
  );

  server.post(
    '/login',
    loginCommon.checkUserAlreadyLoggedIn,
    startErrors,
    validateLoginDetails,
    loginCommon.doLogin,
    loginCommon.redirectToHome,
    utils.getAuths,
    buildModel,
    renderErrors,
  );

  server.get(
    '/logout',
    startErrors,
    loginCommon.unsetCookie,
    loginCommon.redirectToHome,
  );
};
