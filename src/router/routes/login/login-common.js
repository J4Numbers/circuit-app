const config = require('config');
const restifyErrors = require('restify-errors');
const authManager = require('../../../js/authentication-management').default();
const authorisationChecker = require('../../../js/authorisation').default();
const sessionManager = require('../../../js/session-management').default();
const holidayManagerGenerator = require('../../../js/calendar-management').default;
const ActionEnums = require('../../../js/objects/action-enums').default;
const Divisions = require('../../../js/objects/calendar/divisions').default;

/**
 * Given a user ident, we want to check whether a user is still allowed
 * to log in to the system, which we can do by checking whether the user
 * possesses the required action 'CAN_LOGIN'.
 *
 * If they can log in, we do nothing and continue processing, otherwise
 * we kick them back to the homepage.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 * @returns {Promise<void>} - When all actions are completed.
 */
const checkUserAlreadyLoggedIn = async (req, res, next) => {
  try {
    req.log.debug('Testing if current user is already logged in...');
    if (await authorisationChecker.isAuthorised(
      res.nunjucks.userSession.userIdent,
      ActionEnums.CAN_LOGIN,
    )) {
      req.log.debug('User is allowed to log in.');
    } else {
      req.log.debug('User is not authorised to log in. Redirecting to homepage...');
      res.redirect(303, '/', next);
    }
  } catch (e) {
    req.log.warn(`Unable to check authorisation of user :: ${e.message}`);
    next(new restifyErrors.InternalServerError(e.message));
  }

  next();
};

/**
 * Attempt to log in the current user to the site. This is done in two stages:
 * 1. Logging the user in via an authentication manager.
 * 2. Generating the session for the user to be used from now on.
 *
 * The session contains whether they are an anonymous user, and their current
 * holiday calendar, which the generator will work out for us.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 * @returns {Promise<void>} - When all actions are completed.
 */
const doLogin = async (req, res, next) => {
  if (res.authDetails !== undefined) {
    try {
      req.log.debug('Authentication Details found, creating user session...');
      const ident = await authManager.login(res.authDetails);
      let secure = '';
      if (config.get('app.http2.enabled')) {
        secure = 'Secure;';
      }

      let generatedSession;
      const newSessionOptions = {
        userIdent: ident,
        anonymous: false,
        holidayManager: holidayManagerGenerator(Divisions.ENGLAND_AND_WALES),
      };

      if (res.nunjucks.userSession.userIdent === undefined
        || (res.nunjucks.userSession.userIdent.expiry.getTime() <= Date.now())) {
        generatedSession = await sessionManager
          .generateSession(newSessionOptions);
      } else {
        generatedSession = await sessionManager
          .overwriteSession(res.cookies['user-session'], newSessionOptions);
      }

      res.header('Set-Cookie', `user-session=${generatedSession}; Max-Age=3600; Domain=${config.get('app.session_hostname')}; ${secure} HttpOnly; SameSite=Strict`);
      req.log.debug(`Added Set-Cookie header: ${res.header('Set-Cookie')}`);

      res.cookies['user-session'] = generatedSession;
      res.nunjucks.userSession = await sessionManager.getSession(res.cookies['user-session']);
    } catch (e) {
      req.log.warn(`Unable to authenticate the user :: ${e}`);
      res.locals.errors.login = e.message;
    }
  }
  next();
};

/**
 * If no errors occurred during login, then we kick the user back to the
 * homepage so that they can continue their journey. Otherwise, we show them
 * the errors that have been accrued so far.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
const redirectToHome = (req, res, next) => {
  if (Object.keys(res.locals.errors).length === 0) {
    req.log.debug('Login successful. Redirecting user to homepage...');
    res.redirect(303, '/', next);
  } else {
    req.log.debug(`Found ${Object.keys(res.locals.errors).length} errors during login attempt`);
    next();
  }
};

/**
 * When a user wants to log out, we do so by overriding their session cookie
 * to be five minutes in the past, forcing it to expire and for their cookie
 * to be regenerated on the next page.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
const unsetCookie = (req, res, next) => {
  const date = new Date();
  date.setMinutes(-5);
  let secure = '';
  if (config.get('app.http2.enabled')) {
    secure = 'Secure;';
  }
  res.header('Set-Cookie', `user-session=;Expires=${date.toISOString()}; Domain=${config.get('app.hostname')}; ${secure} HttpOnly; SameSite=Strict`);
  next();
};

// All of these are utility methods which are shared out for other files to
// use, however they choose in their chains.
module.exports = {
  checkUserAlreadyLoggedIn,
  doLogin,
  redirectToHome,
  unsetCookie,
};
