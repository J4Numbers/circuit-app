const Browser = require('zombie');
const sessionManager = require('../../../src/js/session-management').default();

const baseLink = 'http://localhost:8199';

describe('The homepage journey', function () {
  let browser;

  beforeEach(function () {
    browser = new Browser({
      runScripts: false,
    });
  });

  it('should render the homepage with manager nav', function () {
    return sessionManager.generateSession(global.generateAdminUserIdent())
      .then((sessionToken) => {
        browser.setCookie('user-session', sessionToken);
        return refreshPage(browser, baseLink).then(() => {
          browser.assert.success();
          browser.assert.element('a[href*="/calendar"');
          browser.assert.element('a[href*="/manager"');
        });
      });
  });

  it('should render the homepage with no manager nav with no ident', function () {
    return refreshPage(browser, baseLink).then(() => {
      browser.assert.success();
      browser.assert.elements('a[href*="/calendar"', 1);
      browser.assert.elements('a[href*="/manager"', 0);
    });
  });

  it('should render the homepage with no manager nav', function () {
    return sessionManager.generateSession(global.generateAnonUserIdent())
      .then((sessionToken) => {
        browser.setCookie('user-session', sessionToken);
        return refreshPage(browser, baseLink).then(() => {
          browser.assert.success();
          browser.assert.elements('a[href*="/calendar"', 1);
          browser.assert.elements('a[href*="/manager"', 0);
        });
      });
  });

  it('should render a login button as an anonymous user', function () {
    return sessionManager.generateSession(global.generateAnonUserIdent())
      .then((sessionToken) => {
        browser.setCookie('user-session', sessionToken);
        return refreshPage(browser, baseLink).then(() => {
          browser.assert.success();
          browser.assert.elements('a[href*="/login"', 1);
        });
      });
  });

  it('should render a logout button as a logged in user', function () {
    return sessionManager.generateSession(global.generateAdminUserIdent())
      .then((sessionToken) => {
        browser.setCookie('user-session', sessionToken);
        return refreshPage(browser, baseLink).then(() => {
          browser.assert.success();
          browser.assert.elements('a[href*="/logout"', 1);
        });
      });
  });

  it('should render an error page on an invalid URL', function () {
    return refreshPage(browser, `${baseLink}/invalid-endpoint`)
      .catch(() => browser.assert.status(404));
  });
});
