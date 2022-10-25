const Browser = require('zombie');
const sessionManager = require('../../../src/js/session-management').default();

const baseLink = 'http://localhost:8199';

describe('The login journey', function () {
  const browser = new Browser({
    runScripts: false,
  });

  it('should load the login page immediately', function () {
    return refreshPage(browser, `${baseLink}/login`).then(() => {
      browser.assert.success();
      browser.assert.url({ pathname: '/login' });
    });
  });

  it('Should stay on the login page when not entering a username', function () {
    return refreshPage(browser, `${baseLink}/login`).then(() => {
      browser.fill('login-name', '');
      browser.fill('login-password', 'password');
      return browser.pressButton('Log in')
        .then(() => {
          browser.assert.success();
          browser.assert.url({ pathname: '/login' });
          browser.assert.text('#login-name-error', 'Error: Please fill in your username');
        });
    });
  });

  it('Should stay on the login page when not entering a password', function () {
    return refreshPage(browser, `${baseLink}/login`).then(() => {
      browser.fill('login-name', '');
      browser.fill('login-password', '');
      return browser.pressButton('Log in')
        .then(() => {
          browser.assert.success();
          browser.assert.url({ pathname: '/login' });
          browser.assert.text('#login-password-error', 'Error: Please fill in your password');
        });
    });
  });

  it('Should stay on the login page with an invalid username and password combo', function () {
    return refreshPage(browser, `${baseLink}/login`).then(() => {
      browser.fill('login-name', 'not-a-username');
      browser.fill('login-password', 'not-a-password');
      return browser.pressButton('Log in')
        .then(() => {
          browser.assert.success();
          browser.assert.url({ pathname: '/login' });
          browser.assert.hasClass('#login', 'govuk-form-group--error');
        });
    });
  });

  it('Should redirect to the homepage on successful login', function () {
    return refreshPage(browser, `${baseLink}/login`).then(() => {
      browser.fill('login-name', 'administrator');
      browser.fill('login-password', 'administrator');
      return browser.pressButton('Log in')
        .then(() => {
          browser.assert.success();
          browser.assert.url({ pathname: '/' });
        });
    });
  });

  it('Should redirect to the homepage when already logged in', function () {
    return sessionManager.generateSession(global.generateAdminUserIdent())
      .then((sessionToken) => {
        browser.setCookie('user-session', sessionToken);
        return refreshPage(browser, `${baseLink}/login`).then(() => {
          browser.assert.success();
          browser.assert.url({ pathname: '/' });
        });
      });
  });

  it('Should redirect to the homepage on successful logout', function () {
    return sessionManager.generateSession(global.generateAdminUserIdent())
      .then((sessionToken) => {
        browser.setCookie('user-session', sessionToken);
        return refreshPage(browser, `${baseLink}/logout`).then(() => {
          browser.assert.success();
          browser.assert.url({ pathname: '/' });
        });
      });
  });
});
