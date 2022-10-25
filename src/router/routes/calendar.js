const restifyErrors = require('restify-errors');
const moment = require('moment');
const ActionEnums = require('../../js/objects/action-enums').default;
const logger = require('../../js/logger/bunyan-logger').default();
const renderer = require('../../js/renderer/nunjucks-renderer').default();
const authorisationChecker = require('../../js/authorisation').default();
const utils = require('./utils');

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

const buildModel = (req, res, next) => {
  res.locals.render = {};
  res.locals.render.auth_list = res.locals.authList;
  res.locals.render.this_year = moment().year();
  res.locals.render.holidays = res.locals.holidays;

  next();
};

const renderResponse = (req, res, next) => {
  res.contentType = 'text/html';
  res.header('content-type', 'text-html');
  res.send(200, renderer.render('pages/calendar.njk', {
    ...res.nunjucks,
    ...res.locals.render,
  }));

  next();
};

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
