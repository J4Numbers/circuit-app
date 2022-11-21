const sessionManager = require('../../../../../src/js/session-management').default();

describe('The login internal page', function () {
  describe('Visiting the login page', function () {
    it('Should redirect a new user to the homepage', function () {
      return request(server())
        .get('/login')
        .then((response) => {
          expect(response).to.have.status(200);
          expect(response).to.be.html;
          expect(response).to.redirectTo(/^http(s?):\/\/([^/]+)\/$/);
        });
    });

    it('Should load correctly to an anonymous user who has already got a session', function () {
      return sessionManager.generateSession(global.generateAnonUserIdent())
        .then((sessionToken) => request(server())
          .get('/login')
          .set('cookie', `user-session=${sessionToken}`)
          .then((response) => {
            expect(response).to.have.status(200);
            expect(response).to.be.html;
            expect(response).to.not.redirect;
          }));
    });

    it('Should redirect a logged in user to the homepage', function () {
      return sessionManager.generateSession(global.generateAdminUserIdent())
        .then((sessionToken) => request(server())
          .get('/login')
          .set('cookie', `user-session=${sessionToken}`)
          .then((response) => {
            expect(response).to.have.status(200);
            expect(response).to.be.html;
            expect(response).to.redirectTo(/^http(s?):\/\/([^/]+)\/$/);
          }));
    });
  });

  describe('Providing login details to the internal login page', function () {
    it('Should redirect back to the homepage after a successful login', function () {
      return request(server())
        .post('/login')
        .send({
          'login-name': 'administrator',
          'login-password': 'administrator',
        })
        .then((response) => {
          expect(response).to.have.status(200);
          expect(response).to.be.html;
          expect(response).to.redirect;
          expect(response).to.redirectTo(/^http(s?):\/\/([^/]+)\/$/);
        });
    });

    it('Should redirect back to the login page on an empty login', function () {
      return sessionManager.generateSession(global.generateAnonUserIdent())
        .then((sessionToken) => request(server())
          .post('/login')
          .set('cookie', `user-session=${sessionToken}`)
          .send({
            'login-name': '',
            'login-password': '',
          })
          .then((response) => {
            expect(response).to.have.status(200);
            expect(response).to.be.html;
            expect(response).to.not.redirect;
          }));
    });

    it('Should redirect back to the login page on a failed login', function () {
      return sessionManager.generateSession(global.generateAnonUserIdent())
        .then((sessionToken) => request(server())
          .post('/login')
          .set('cookie', `user-session=${sessionToken}`)
          .send({
            'login-name': 'username',
            'login-password': 'failed-password',
          })
          .then((response) => {
            expect(response).to.have.status(200);
            expect(response).to.be.html;
            expect(response).to.not.redirect;
          }));
    });
  });

  describe('The logout internal page', function () {
    it('Should redirect a logged out user to the homepage', function () {
      return sessionManager.generateSession(global.generateAdminUserIdent())
        .then((sessionToken) => request(server())
          .get('/logout')
          .set('cookie', `user-session=${sessionToken}`)
          .then((response) => {
            expect(response).to.have.status(200);
            expect(response).to.be.html;
            expect(response).to.redirectTo(/^http(s?):\/\/([^/]+)\/$/);
            expect(response).to.not.have.cookie('user-session');
          }));
    });
  });
});
