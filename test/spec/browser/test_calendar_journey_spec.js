const Browser = require('zombie');
const sessionManager = require('../../../src/js/session-management').default();

const baseLink = 'http://localhost:8199';

describe('The calendar journey', function () {
  let browser;

  beforeEach(function () {
    browser = new Browser({
      runScripts: false,
    });
  });

  it('should render the calendar with an administrator ident', function () {
    return sessionManager.generateSession(global.generateAdminUserIdent())
      .then((sessionToken) => {
        browser.setCookie('user-session', sessionToken);
        return refreshPage(browser, `${baseLink}/calendar`).then(() => {
          browser.assert.success();
          browser.assert.url({ pathname: '/calendar' });
        });
      });
  });

  it('should redirect to the homepage with no ident', function () {
    return refreshPage(browser, `${baseLink}/calendar`).then(() => {
      browser.assert.success();
      browser.assert.url({ pathname: '/' });
    });
  });

  it('should render the calendar with an anonymous ident', function () {
    return sessionManager.generateSession(global.generateAnonUserIdent())
      .then((sessionToken) => {
        browser.setCookie('user-session', sessionToken);
        return refreshPage(browser, `${baseLink}/calendar`).then(() => {
          browser.assert.success();
          browser.assert.url({ pathname: '/calendar' });
        });
      });
  });
});
