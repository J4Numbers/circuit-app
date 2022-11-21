const sessionManager = require('../../../../src/js/session-management').default();

describe('The calendar routes', function () {
  after(function () {
    stopMockRequire('config');
  });

  it('Should redirect to the homepage on request with no ident', function () {
    return request(server())
      .get('/calendar')
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response).to.be.html;
        expect(response).to.redirectTo(/^http(s?):\/\/([^/]+)\/$/);
      });
  });

  it('Should return a copy of the calendar view on request with an anonymous ident', function () {
    return sessionManager.generateSession(global.generateAnonUserIdent())
      .then((sessionToken) => request(server())
        .get('/calendar')
        .set('cookie', `user-session=${sessionToken}`)
        .then((response) => {
          expect(response).to.have.status(200);
          expect(response).to.be.html;
          expect(response).to.not.redirect;
        }));
  });

  it('Should return a copy of the calendar view on request with an administrator ident', function () {
    return sessionManager.generateSession(global.generateAdminUserIdent())
      .then((sessionToken) => request(server())
        .get('/calendar')
        .set('cookie', `user-session=${sessionToken}`)
        .then((response) => {
          expect(response).to.have.status(200);
          expect(response).to.be.html;
          expect(response).to.not.redirect;
        }));
  });
});
