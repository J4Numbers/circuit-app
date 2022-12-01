const restifyErrors = require('restify-errors');
const moment = require('moment');
const ActionEnums = require('../../js/objects/action-enums').default;
const logger = require('../../js/logger/bunyan-logger').default();
const renderer = require('../../js/renderer/nunjucks-renderer').default();
const authorisationChecker = require('../../js/authorisation').default();
const utils = require('./utils');

/**
 * Check whether the user is allowed to view the calendar (which they are
 * usually except for if they're completely new to the site).
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 * @returns {Promise<void>} - When all actions are completed.
 */
const isUserAuthorisedToViewPage = async (req, res, next) => {
  res.locals.errors = {};
  try {
    if (!await authorisationChecker
      .isAuthorised(res.nunjucks.userSession.userIdent, ActionEnums.VIEW_CALENDAR)
    ) {
      res.redirect(303, '/', next);
    }
  } catch (e) {
    logger.warn(`Unable to check authorisation of user :: ${e.message}`);
    next(new restifyErrors.InternalServerError(e.message));
  }
  next();
};

/**
 * Get the personal holidays associated with a given user, sorted from earliest
 * to latest.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 * @returns {Promise<void>} - When all actions have been completed.
 */
const loadAvailableHolidays = async (req, res, next) => {
  try {
    const holidays = await res.nunjucks.userSession.holidayManager.getAllHolidays();
    res.locals.holidays = holidays.sort(
      (dayA, dayB) => {
        if (dayA.date.isAfter(dayB.date)) {
          return 1;
        }
        if (dayA.date.isSame(dayB.date)) {
          return 0;
        }
        return -1;
      },
    );
    next();
  } catch (e) {
    req.log.warn(`Unable to load holidays for user :: ${e.message}`);
    next(new restifyErrors.InternalServerError(e.message));
  }
};

/**
 * Fill in the data model that is going to be used to populate the view
 * screen with user data.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
const buildModel = (req, res, next) => {
  res.locals.render = {};
  res.locals.render.auth_list = res.locals.authList;
  res.locals.render.this_year = moment().year();
  res.locals.render.holidays = res.locals.holidays;

  next();
};

/**
 * Render the view page with all the data we have built up throughout
 * this journey.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
const renderResponse = (req, res, next) => {
  res.contentType = 'text/html';
  res.header('content-type', 'text-html');
  res.send(200, renderer.render('pages/calendar.njk', {
    ...res.nunjucks,
    ...res.locals.render,
  }));

  next();
};

/**
 * Load in the calendar endpoint to the server.
 *
 * @param {object} server - The server object that we are slowly fleshing
 * out.
 */
module.exports = (server) => {
  server.get(
    '/calendar',
    isUserAuthorisedToViewPage,
    utils.getAuths,
    loadAvailableHolidays,
    buildModel,
    renderResponse,
  );
};
