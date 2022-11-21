const moment = require('moment');
const sessionManager = require('../../../../src/js/session-management').default();

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

describe('The manager routes', function () {
  after(function () {
    stopMockRequire('config');
  });

  it('Should redirect to the homepage on request with no ident', function () {
    return request(server())
      .get('/manager')
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response).to.be.html;
        expect(response).to.redirectTo(/^http(s?):\/\/([^/]+)\/$/);
      });
  });

  it('Should return a copy of the manager view on request with an anonymous ident', function () {
    return sessionManager.generateSession(global.generateAnonUserIdent())
      .then((sessionToken) => request(server())
        .get('/manager')
        .set('cookie', `user-session=${sessionToken}`)
        .then((response) => {
          expect(response).to.have.status(200);
          expect(response).to.be.html;
          expect(response).to.redirectTo(/^http(s?):\/\/([^/]+)\/$/);
        }));
  });

  it('Should return a copy of the manager view on request with an administrator ident', function () {
    return sessionManager.generateSession(global.generateAdminUserIdent())
      .then((sessionToken) => request(server())
        .get('/manager')
        .set('cookie', `user-session=${sessionToken}`)
        .then((response) => {
          expect(response).to.have.status(200);
          expect(response).to.be.html;
          expect(response).to.not.redirect;
        }));
  });

  it('Should not display any errors when loading the page', function () {
    return sessionManager.generateSession(global.generateAdminUserIdent())
      .then((sessionToken) => request(server())
        .get('/manager')
        .set('cookie', `user-session=${sessionToken}`)
        .then((response) => {
          expect(response).to.have.status(200);
          expect(response).to.be.html;
          expect(response.text).to.not.contain('There was a problem');
          expect(response).to.not.redirect;
        }));
  });

  describe('Adding a new day to the calendar', function () {
    it('Should redirect to the homepage on visiting the adding page with no ident', function () {
      return request(server())
        .get('/manager/add')
        .then((response) => {
          expect(response).to.have.status(200);
          expect(response).to.be.html;
          expect(response).to.redirectTo(/^http(s?):\/\/([^/]+)\/$/);
        });
    });

    it('Should redirect to the homepage on visiting the adding page with an anonymous indent', function () {
      return sessionManager.generateSession(global.generateAnonUserIdent())
        .then((sessionToken) => request(server())
          .get('/manager/add')
          .set('cookie', `user-session=${sessionToken}`)
          .then((response) => {
            expect(response).to.have.status(200);
            expect(response).to.be.html;
            expect(response).to.redirectTo(/^http(s?):\/\/([^/]+)\/$/);
          }));
    });

    it('Should display the addition page successfully with an administrator indent', function () {
      return sessionManager.generateSession(global.generateAdminUserIdent())
        .then((sessionToken) => request(server())
          .get('/manager/add')
          .set('cookie', `user-session=${sessionToken}`)
          .then((response) => {
            expect(response).to.have.status(200);
            expect(response).to.be.html;
            expect(response).to.not.redirect;
          }));
    });

    it('Should redirect to the homepage on creating a new holiday with no ident', function () {
      return request(server())
        .post('/manager/add')
        .send({})
        .then((response) => {
          expect(response).to.have.status(200);
          expect(response).to.be.html;
          expect(response).to.redirectTo(/^http(s?):\/\/([^/]+)\/$/);
        });
    });

    it('Should redirect to the homepage on creating a new holiday with an anonymous indent', function () {
      return sessionManager.generateSession(global.generateAnonUserIdent())
        .then((sessionToken) => request(server())
          .post('/manager/add')
          .send({})
          .set('cookie', `user-session=${sessionToken}`)
          .then((response) => {
            expect(response).to.have.status(200);
            expect(response).to.be.html;
            expect(response).to.redirectTo(/^http(s?):\/\/([^/]+)\/$/);
          }));
    });

    it('Should redirect to the manager page when creating a new holiday with an administrator indent', function () {
      const thisYear = new Date().getFullYear();
      const dateToCreate = calculateFirstNonWeekendInAYear(thisYear);
      return sessionManager.generateSession(global.generateAdminUserIdent())
        .then((sessionToken) => request(server())
          .post('/manager/add')
          .send({
            'holiday-title': 'example holiday',
            'holiday-date': dateToCreate,
          })
          .set('cookie', `user-session=${sessionToken}`)
          .then((response) => {
            expect(response).to.have.status(200);
            expect(response).to.be.html;
            expect(response).to.redirectTo(/^http(s?):\/\/([^/]+)\/manager$/);
            return sessionManager.getSession(sessionToken)
              .then((session) => session.holidayManager.getAllHolidays())
              .then((holidays) => expect(
                holidays.filter((singleDay) => singleDay.date.isSame(dateToCreate)),
              ).to.have.lengthOf(1));
          }));
    });

    it('Should display an error page when creating a new holiday with no details', function () {
      return sessionManager.generateSession(global.generateAdminUserIdent())
        .then((sessionToken) => request(server())
          .post('/manager/add')
          .send({})
          .set('cookie', `user-session=${sessionToken}`)
          .then((response) => {
            expect(response).to.have.status(400);
            expect(response).to.be.html;
            expect(response.text).to.contain('There was a problem');
          }));
    });

    it('Should display an error page when creating a new holiday with a missing title', function () {
      const thisYear = new Date().getFullYear();
      const dateToCreate = calculateFirstNonWeekendInAYear(thisYear);
      return sessionManager.generateSession(global.generateAdminUserIdent())
        .then((sessionToken) => request(server())
          .post('/manager/add')
          .send({
            'holiday-title': '',
            'holiday-date': dateToCreate,
          })
          .set('cookie', `user-session=${sessionToken}`)
          .then((response) => {
            expect(response).to.have.status(400);
            expect(response).to.be.html;
            expect(response.text).to.contain('Please fill in a title for the holiday you are taking');
          }));
    });

    it('Should display an error page when creating a new holiday with an invalid date', function () {
      const thisYear = new Date().getFullYear();
      return sessionManager.generateSession(global.generateAdminUserIdent())
        .then((sessionToken) => request(server())
          .post('/manager/add')
          .send({
            'holiday-title': 'example holiday',
            'holiday-date': `${thisYear}-99-99`,
          })
          .set('cookie', `user-session=${sessionToken}`)
          .then((response) => {
            expect(response).to.have.status(400);
            expect(response).to.be.html;
            expect(response.text).to.contain('Please input a valid date');
          }));
    });

    it('Should display an error page when creating a new holiday with an already existing holiday', function () {
      const thisYear = new Date().getFullYear();
      const dateToAdd = calculateFirstWeekendInAYear(thisYear);
      return sessionManager.generateSession(global.generateAdminUserIdent())
        .then((sessionToken) => request(server())
          .post('/manager/add')
          .send({
            'holiday-title': 'example holiday',
            'holiday-date': dateToAdd,
          })
          .set('cookie', `user-session=${sessionToken}`)
          .then((response) => {
            expect(response).to.have.status(400);
            expect(response).to.be.html;
            expect(response.text).to.contain('Day to add already exists in calendar management');
          }));
    });
  });

  describe('Removing a day from the calendar', function () {
    it('Should redirect to the homepage on posting a date to remove with no ident', function () {
      const thisYear = new Date().getFullYear();
      return request(server())
        .post(`/manager/remove/${calculateFirstWeekendInAYear(thisYear)}`)
        .then((response) => {
          expect(response).to.have.status(200);
          expect(response).to.be.html;
          expect(response).to.redirectTo(/^http(s?):\/\/([^/]+)\/$/);
        });
    });

    it('Should redirect to the homepage on posting a date to remove with an anonymous ident', function () {
      const thisYear = new Date().getFullYear();
      return sessionManager.generateSession(global.generateAnonUserIdent())
        .then((sessionToken) => request(server())
          .post(`/manager/remove/${calculateFirstWeekendInAYear(thisYear)}`)
          .set('cookie', `user-session=${sessionToken}`)
          .then((response) => {
            expect(response).to.have.status(200);
            expect(response).to.be.html;
            expect(response).to.redirectTo(/^http(s?):\/\/([^/]+)\/$/);
          }));
    });

    it('Should redirect to the manager view on a successful date removal', function () {
      const thisYear = new Date().getFullYear();
      const dateToRemove = calculateFirstWeekendInAYear(thisYear);
      return sessionManager.generateSession(global.generateAdminUserIdent())
        .then((sessionToken) => request(server())
          .post(`/manager/remove/${dateToRemove}`)
          .set('cookie', `user-session=${sessionToken}`)
          .then((response) => {
            expect(response).to.have.status(200);
            expect(response).to.be.html;
            expect(response).to.redirectTo(/^http(s?):\/\/([^/]+)\/manager$/);
            return sessionManager.getSession(sessionToken)
              .then((session) => session.holidayManager.getAllHolidays())
              .then((holidays) => expect(
                holidays.filter((singleDay) => singleDay.date.isSame(dateToRemove)),
              ).to.have.lengthOf(0));
          }));
    });

    it('Should display an error page when attempting to remove a missing date', function () {
      const thisYear = new Date().getFullYear();
      const dateToRemove = calculateFirstNonWeekendInAYear(thisYear);
      return sessionManager.generateSession(global.generateAdminUserIdent())
        .then((sessionToken) => request(server())
          .post(`/manager/remove/${dateToRemove}`)
          .set('cookie', `user-session=${sessionToken}`)
          .then((response) => {
            expect(response).to.have.status(400);
            expect(response.text).to.contain('Day to remove does not exist in calendar management');
            expect(response).to.be.html;
            expect(response).to.not.redirect;
          }));
    });
  });
});
