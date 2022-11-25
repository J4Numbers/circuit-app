const renderer = require('../../../js/renderer/nunjucks-renderer').default();
const loginCommon = require('./login-common');
const utils = require('../utils');

/**
 * Create a working variable in the response object (which is persisted between
 * method chains - unlike the request object) that will contain any errors that
 * we find during the processing of our requests.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
const startErrors = (req, res, next) => {
  res.locals.errors = {};
  next();
};

/**
 * Attempt to validate the inputs of the login page to a basic level - more
 * in the sense of whether the user has actually filled in the fields that
 * they were asked for.
 *
 * On a successful validation, the fields are packaged into an authDetails
 * object that will be passed on to an authentication manager.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
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

/**
 * Fill in the data model that is going to be used to populate the view
 * screen.
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
 * Render the login page with any errors that were previously discovered in
 * the journey to log in a user.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
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

/**
 * Render the normal response page for when a user is attempting to log in to
 * the site.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
const renderResponse = (req, res, next) => {
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
    // Getting the login page will show the user the page if they are
    // allowed to log in to the site.
    '/login',
    loginCommon.checkUserAlreadyLoggedIn,
    utils.getAuths,
    buildModel,
    renderResponse,
  );

  // Posting some details to the login page will allow a user who is
  // allowed to log in to gain further accesses to the site as required.
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

  // The logout page is technically accessible to anyone, and will forcibly
  // expire the user session cookie.
  server.get(
    '/logout',
    startErrors,
    loginCommon.unsetCookie,
    loginCommon.redirectToHome,
  );
};
