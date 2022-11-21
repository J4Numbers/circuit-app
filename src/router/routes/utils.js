// utils.js
// A class containing re-usable code for the project
// --------------
const config = require('config');
const restifyErrors = require('restify-errors');
const authorisationChecker = require('../../js/authorisation').default();
const authenticationManager = require('../../js/authentication-management').default();
const sessionManager = require('../../js/session-management').default();
const holidayManagerGenerator = require('../../js/calendar-management').default;
const Divisions = require('../../js/objects/calendar/divisions').default;
const ActionEnums = require('../../js/objects/action-enums').default;

module.exports = {
  async getAuths(req, res, next) {
    res.locals.authList = {};
    res.locals.authList[ActionEnums.VIEW_HOMEPAGE] = await authorisationChecker
      .isAuthorised(res.nunjucks.userSession.userIdent, ActionEnums.VIEW_HOMEPAGE);
    res.locals.authList[ActionEnums.VIEW_CALENDAR] = await authorisationChecker
      .isAuthorised(res.nunjucks.userSession.userIdent, ActionEnums.VIEW_CALENDAR);
    res.locals.authList[ActionEnums.VIEW_MANAGER] = await authorisationChecker
      .isAuthorised(res.nunjucks.userSession.userIdent, ActionEnums.VIEW_MANAGER);
    next();
  },

  async isUserRegistered(req, res, next) {
    if (res.nunjucks.userSession.userIdent === undefined
      || (res.nunjucks.userSession.userIdent.expiry.getTime() <= Date.now())) {
      req.log.debug('User is not logged in, or session has expired. Generating anonymous identity...');
      const ident = await authenticationManager.anonymousLogin();

      let secure = '';
      if (config.get('app.http2.enabled')) {
        secure = 'Secure;';
      }

      try {
        const generatedSession = await sessionManager
          .generateSession({
            userIdent: ident,
            anonymous: true,
            holidayManager: holidayManagerGenerator(Divisions.ENGLAND_AND_WALES),
          });

        res.header(
          'Set-Cookie',
          `user-session=${generatedSession}; Max-Age=3600; Domain=${config.get('app.session_hostname')}; ${secure} HttpOnly; SameSite=Strict`,
        );
        req.log.debug(`Added Set-Cookie header: ${res.header('Set-Cookie')}`);

        res.cookies['user-session'] = generatedSession;
        res.nunjucks.userSession = await sessionManager.getSession(res.cookies['user-session']);
      } catch (e) {
        req.log.warn(`Error when generating a new session - ${e}`);
        next(new restifyErrors.InternalServerError(e));
      }
    }
    next();
  },
};
