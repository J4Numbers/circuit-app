const restifyErrors = require('restify-errors');
const moment = require('moment');
const ActionEnums = require('../../js/objects/action-enums').default;
const logger = require('../../js/logger/bunyan-logger').default();
const renderer = require('../../js/renderer/nunjucks-renderer').default();
const authorisationChecker = require('../../js/authorisation').default();
const utils = require('./utils');

/**
 * Check whether the user is allowed to view the calendar manager (which
 * they are not usually except for if they're a full user).
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

/**
 * Check whether the user is allowed to modify the calendar manager (which
 * they are not usually except for if they're a full user).
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 * @returns {Promise<void>} - When all actions are completed.
 */
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

/**
 * Create a working variable in the response object (which is persisted between
 * method chains - unlike the request object) that will contain any errors that
 * we find during the processing of our requests.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
const loadErrors = (req, res, next) => {
  res.locals.errors = {};
  next();
};

/**
 * Load all the holidays that the user is currently planning on having into
 * the local response to be passed on for future rendering. We also ensure that
 * the response is sorted from earliest to latest.
 *
 * In the event of a failure at this stage, we will display a hard error page
 * to the user.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 * @returns {Promise<void>} - When all actions are completed.
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
 * Validate all fields that we ask the user to fill in when adding a new date
 * to their holiday calendar. This includes making sure that both the title
 * and the actual date that is being added. Validation on the notes and the
 * bunting field is not required due to the optional nature of the field, and
 * the boolean nature of the field respectively.
 *
 * In the event that an error is found, we add the field 'name' attribute to
 * the error object that we're passing down, and fill in the error that we're
 * returning to be shown to the user in an error summary.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
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

/**
 * Attempt to add a date to the calendar of the current user. On success, we
 * will add a new 'toast' popup that will display the successful addition,
 * otherwise a general error will be added to the page to be displayed to
 * the user.
 *
 * Note: We only actually attempt the addition of a new day to the calendar
 * if all validation checks passed okay.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 * @returns {Promise<void>} - When all actions are completed.
 */
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

/**
 * Attempt to remove a date from the calendar of the current user. On success,
 * we will add a new 'toast' popup that will display the successful removal,
 * otherwise a general error will be added to the page to be displayed to
 * the user.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 * @returns {Promise<void>} - When all actions are completed.
 */
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
 * Fill in the data model that is going to be used to populate the view
 * screen with user data.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
const buildCreateModel = (req, res, next) => {
  res.locals.render = {};
  res.locals.render.auth_list = res.locals.authList;
  res.locals.render.this_year = moment().year();
  res.locals.render.body = req.body;

  next();
};

/**
 * If no errors were found during processing of a page, then redirect the
 * user to the base manager page, otherwise we continue onwards to where
 * the user can be shown their errors.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
const redirectOnNoErrors = (req, res, next) => {
  if (Object.keys(res.locals.errors).length === 0) {
    res.redirect(303, '/manager', next);
  } else {
    next();
  }
};

/**
 * Render the normal response page for when a user is attempting to view
 * their existing holiday calendar in manager mode.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
const renderResponse = (req, res, next) => {
  res.contentType = 'text/html';
  res.header('content-type', 'text-html');
  res.send(200, renderer.render('pages/manager.njk', {
    ...res.nunjucks,
    ...res.locals.render,
  }));

  next();
};

/**
 * Render the normal response page for when a user is attempting to create
 * a new holiday within their calendar.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
const renderCreateResponse = (req, res, next) => {
  res.contentType = 'text/html';
  res.header('content-type', 'text-html');
  res.send(200, renderer.render('pages/manager-add-day.njk', {
    ...res.nunjucks,
    ...res.locals.render,
  }));

  next();
};

/**
 * Render the page with any errors that were found during the journey
 * of adding a new day to the site.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
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

/**
 * Render the page with any errors that were found when attempting to remove
 * a day from a user's calendar.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {Next} next - The chain handler for passing on responsibility.
 */
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
    // Getting the general manager page shows the user their calendar, but
    // with the option to add or remove days.
    '/manager',
    isUserAuthorisedToViewPage,
    utils.getAuths,
    loadAvailableHolidays,
    buildModel,
    renderResponse,
  );
  // Getting the add new holiday page allows the user to currently add in
  // a single holiday day to their calendar.
  server.get(
    '/manager/add',
    isUserAuthorisedToViewPage,
    utils.getAuths,
    buildCreateModel,
    renderCreateResponse,
  );
  // Posting to the remove day page allows the user to remove a day from
  // their calendar.
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
  // Posting to the add new holiday page allows the user to submit their
  // requested holiday and add it to their existing calendar.
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
