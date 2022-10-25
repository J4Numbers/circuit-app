const Browser = require('zombie');
const moment = require('moment');
const sessionManager = require('../../../src/js/session-management').default();

const baseLink = 'http://localhost:8199';

const calculateFirstNonWeekendInAYear = (year) => moment(`${year}-01-01`, 'YYYY-MM-DD')
  .day('wednesday')
  .format('YYYY-MM-DD');

const calculateFirstWeekendInAYear = (year) => {
  const dateToLookup = moment(`${year}-01-01`, 'YYYY-MM-DD');
  do {
    if (dateToLookup.day() === 0 || dateToLookup.day() === 6) {
      return dateToLookup.format('YYYY-MM-DD');
    }
    dateToLookup.add(1, 'day');
  } while (dateToLookup.year() === year);
  return `${year}-01-01`;
};

describe('The manager journey', function () {
  let browser;

  beforeEach(function () {
    browser = new Browser({
      runScripts: true,
    });
  });

  it('should render the manager with an administrator ident with a link to add a new holiday', function () {
    return sessionManager.generateSession(global.generateAdminUserIdent())
      .then((sessionToken) => {
        browser.setCookie('user-session', sessionToken);
        return refreshPage(browser, `${baseLink}/manager`).then(() => {
          browser.assert.success();
          browser.assert.url({ pathname: '/manager' });
        });
      });
  });

  it('should display a link to add a new holiday which leads to the creation page', function () {
    return sessionManager.generateSession(global.generateAdminUserIdent())
      .then((sessionToken) => {
        browser.setCookie('user-session', sessionToken);
        return refreshPage(browser, `${baseLink}/manager`).then(() => {
          browser.assert.success();
          browser.assert.url({ pathname: '/manager' });
          return browser.clickLink('a#holiday-add-start')
            .then(() => {
              browser.assert.success();
              browser.assert.url({ pathname: '/manager/add' });
            });
        });
      });
  });

  it('should create a new holiday when all required fields are filled out correctly', function () {
    const thisYear = new Date().getFullYear();
    const dateToAdd = calculateFirstNonWeekendInAYear(thisYear);
    return sessionManager.generateSession(global.generateAdminUserIdent())
      .then((sessionToken) => {
        browser.setCookie('user-session', sessionToken);
        return refreshPage(browser, `${baseLink}/manager/add`).then(() => {
          browser.assert.success();
          browser.assert.url({ pathname: '/manager/add' });
          browser.fill('holiday-title', 'example-title');
          browser.fill('holiday-date', dateToAdd);
          return browser.pressButton('#holiday-submit')
            .then(() => {
              browser.assert.success();
              browser.assert.url({ pathname: '/manager' });
              browser.assert.elements(`#calendar-date-${dateToAdd}`, { exactly: 1 });
            });
        });
      });
  });

  it('should fail to create a holiday when no details are filled out', function () {
    return sessionManager.generateSession(global.generateAdminUserIdent())
      .then((sessionToken) => {
        browser.setCookie('user-session', sessionToken);
        return refreshPage(browser, `${baseLink}/manager/add`).then(() => {
          browser.assert.success();
          browser.assert.url({ pathname: '/manager/add' });
          return browser.pressButton('#holiday-submit')
            .then(() => {
              browser.assert.status(400, 'Browser should have returned user error');
            })
            .catch(() => {
              browser.assert.status(400);
              browser.assert.url({ pathname: '/manager/add' });
              browser.assert.elements('.govuk-error-summary', { exactly: 1 });
              browser.assert.elements('.govuk-form-group--error', { atLeast: 2 });
            });
        });
      });
  });

  it('should remove a given date on requesting such', function () {
    const thisYear = new Date().getFullYear();
    const dateToRemove = calculateFirstWeekendInAYear(thisYear);
    return sessionManager.generateSession(global.generateAdminUserIdent())
      .then((sessionToken) => {
        browser.setCookie('user-session', sessionToken);
        return refreshPage(browser, `${baseLink}/manager`).then(() => {
          browser.assert.success();
          browser.assert.url({ pathname: '/manager' });
          const dates = browser.query('.calendar-date').length;
          browser.assert.elements(`#calendar-date-${dateToRemove}`, { exactly: 1 });
          return browser.click(`#calendar-date-${dateToRemove}-remove`)
            .then(() => {
              browser.assert.success();
              browser.assert.url({ pathname: '/manager' });
              browser.assert.elements('.calendar-date', { exactly: dates - 1 });
            });
        });
      });
  });

  it('should redirect to the homepage with no ident', function () {
    return refreshPage(browser, `${baseLink}/manager`).then(() => {
      browser.assert.success();
      browser.assert.url({ pathname: '/' });
    });
  });

  it('should redirect to the homepage with an anonymous ident', function () {
    return sessionManager.generateSession(global.generateAnonUserIdent())
      .then((sessionToken) => {
        browser.setCookie('user-session', sessionToken);
        return refreshPage(browser, `${baseLink}/manager`).then(() => {
          browser.assert.success();
          browser.assert.url({ pathname: '/' });
        });
      });
  });
});
