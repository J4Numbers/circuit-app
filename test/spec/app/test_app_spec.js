const nock = require('nock');
const sessionManager = require('../../../src/js/session-management').default();

const generateBaseNock = () => nock('https://www.gov.uk');

const generateBaseBankHolidaysMock = () => ({
  'england-and-wales': {
    division: 'england-and-wales',
    events: [],
  },
  'scotland': {
    division: 'scotland',
    events: [],
  },
  'northern-ireland': {
    division: 'northern-ireland',
    events: [],
  },
});

describe('The application over HTTP', function () {
  after(function () {
    stopMockRequire('config');
  });

  afterEach(function () {
    nock.cleanAll();
  });

  describe('Homepage', function () {
    it('Should return a copy of the homepage on request with a new ident', function () {
      const nockedPath = generateBaseNock()
        .get('/bank-holidays.json')
        .reply(200, generateBaseBankHolidaysMock());

      return request(server())
        .get('/')
        .then((response) => {
          expect(nockedPath.isDone()).to.be.true;
          expect(response).to.have.status(200);
          expect(response).to.be.html;
        });
    });

    it('Should return a copy of the homepage on request with a generated ident', function () {
      const nockedPath = generateBaseNock()
        .get('/bank-holidays.json')
        .reply(200, generateBaseBankHolidaysMock());
      return sessionManager.generateSession(global.generateAnonUserIdent())
        .then((sessionToken) => request(server())
          .get('/')
          .set('cookie', `user-session=${sessionToken}`)
          .then((response) => {
            expect(nockedPath.isDone()).to.be.true;
            expect(response).to.have.status(200);
            expect(response).to.be.html;
          }));
    });
  });

  describe('Error pages', function () {
    it('Should return a 404 if the page does not exist', function () {
      return request(server())
        .get('/this-page-does-not-exist')
        .then((response) => {
          expect(response).to.have.status(404);
          expect(response).to.be.html;
        });
    });
  });
});
