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
      .isAuthorised(res.nunjucks.userSession.userIdent, ActionEnums.VIEW_MANAGER)
    ) {
      res.redirect(303, '/', next);
    }
  } catch (e) {
    logger.warn(`Unable to check authorisation of user :: ${e.message}`);
    next(new restifyErrors.InternalServerError(e.message));
  }
  next();
};

const isUserAuthorisedToModifyPage = async (req, res, next) => {
  res.locals.errors = {};
  try {
    if (!await authorisationChecker
      .isAuthorised(res.nunjucks.userSession.userIdent, ActionEnums.UPDATE_MANAGER)
    ) {
      res.redirect(303, '/', next);
    }
  } catch (e) {
    logger.warn(`Unable to check authorisation of user :: ${e.message}`);
    next(new restifyErrors.InternalServerError(e.message));
  }
  next();
};

const loadErrors = (req, res, next) => {
  res.locals.errors = {};
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

const validateDateAddition = (req, res, next) => {
  if (!Object.prototype.hasOwnProperty.call(req.body, 'holiday-date')
      || req.body['holiday-date'] === '') {
    res.locals.errors['holiday-date'] = 'Please fill in the date you would like to add';
  } else if (!moment(req.body['holiday-date'], 'YYYY-MM-DD', true).isValid()) {
    res.locals.errors['holiday-date'] = 'Please input a valid date';
  }
  if (!Object.prototype.hasOwnProperty.call(req.body, 'holiday-title')
      || req.body['holiday-title'] === '') {
    res.locals.errors['holiday-title'] = 'Please fill in a title for the holiday you are taking';
  }
  next();
};

const attemptDateAddition = async (req, res, next) => {
  if (Object.keys(res.locals.errors).length === 0) {
    try {
      await res.nunjucks.userSession.holidayManager.addNewHoliday({
        date: moment(req.body['holiday-date']),
        title: req.body['holiday-title'],
        notes: req.body['holiday-notes'] || '',
        bunting: req.body['holiday-bunting'] === 'yes',
      });
      res.nunjucks.userSession.toasts.push({
        title: 'Holiday created',
        html: `<span class="govuk-!-font-weight-bold">Added ${req.body['holiday-date']} to your calendar</span>`,
      });
    } catch (e) {
      res.locals.errors['holiday-date'] = e.message;
    }
  }
  next();
};

const attemptDateRemoval = async (req, res, next) => {
  try {
    await res.nunjucks.userSession.holidayManager.removeOneHoliday(moment(req.params.dateToRemove));
    res.nunjucks.userSession.toasts.push({
      title: 'Holiday removed',
      html: `<span class="govuk-!-font-weight-bold">Removed ${req.params.dateToRemove} from your calendar</span>`,
    });
  } catch (e) {
    res.locals.errors['date-to-remove'] = e.message;
  }
  next();
};

const buildModel = (req, res, next) => {
  res.locals.render = {};
  res.locals.render.auth_list = res.locals.authList;
  res.locals.render.this_year = moment().year();
  res.locals.render.holidays = res.locals.holidays;

  next();
};

const buildCreateModel = (req, res, next) => {
  res.locals.render = {};
  res.locals.render.auth_list = res.locals.authList;
  res.locals.render.this_year = moment().year();
  res.locals.render.body = req.body;

  next();
};

const redirectOnNoErrors = (req, res, next) => {
  if (Object.keys(res.locals.errors).length === 0) {
    res.redirect(303, '/manager', next);
  } else {
    next();
  }
};

const renderResponse = (req, res, next) => {
  res.contentType = 'text/html';
  res.header('content-type', 'text-html');
  res.send(200, renderer.render('pages/manager.njk', {
    ...res.nunjucks,
    ...res.locals.render,
  }));

  next();
};

const renderCreateResponse = (req, res, next) => {
  res.contentType = 'text/html';
  res.header('content-type', 'text-html');
  res.send(200, renderer.render('pages/manager-add-day.njk', {
    ...res.nunjucks,
    ...res.locals.render,
  }));

  next();
};

const renderCreateErrors = (req, res, next) => {
  res.contentType = 'text/html';
  res.header('content-type', 'text-html');
  res.send(400, renderer.render('pages/manager-add-day.njk', {
    ...res.nunjucks,
    ...res.locals.render,

    errors: res.locals.errors,
  }));

  next();
};

const renderRemovalErrors = (req, res, next) => {
  res.contentType = 'text/html';
  res.header('content-type', 'text-html');
  res.send(400, renderer.render('pages/manager.njk', {
    ...res.nunjucks,
    ...res.locals.render,

    errors: res.locals.errors,
  }));

  next();
};

module.exports = (server) => {
  server.get(
    '/manager',
    isUserAuthorisedToViewPage,
    utils.getAuths,
    loadAvailableHolidays,
    buildModel,
    renderResponse,
  );
  server.get(
    '/manager/add',
    isUserAuthorisedToViewPage,
    utils.getAuths,
    buildCreateModel,
    renderCreateResponse,
  );
  server.post(
    '/manager/remove/:dateToRemove',
    isUserAuthorisedToModifyPage,
    utils.getAuths,
    loadErrors,
    attemptDateRemoval,
    redirectOnNoErrors,
    buildCreateModel,
    renderRemovalErrors,
  );
  server.post(
    '/manager/add',
    isUserAuthorisedToModifyPage,
    utils.getAuths,
    loadErrors,
    validateDateAddition,
    attemptDateAddition,
    redirectOnNoErrors,
    buildCreateModel,
    renderCreateErrors,
  );
};
