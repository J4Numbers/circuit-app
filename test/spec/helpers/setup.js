const chai = require('chai');
const sinon = require('sinon');

const chaiAsPromised = require('chai-as-promised');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');

const clearModule = require('clear-module');
const importFresh = require('import-fresh');
const mockRequire = require('mock-require');

const holidayManagerGenerator = require('../../../src/js/calendar-management').default;
const Divisions = require('../../../src/js/objects/calendar/divisions').default;

process.env.NODE_ENV = 'test';

chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.use(sinonChai);

global.sinon = sinon;
global.expect = chai.expect;
global.request = chai.request;

// eslint-disable-next-line import/no-dynamic-require,global-require
global.testRequire = (moduleName) => require(moduleName);
global.importFresh = (moduleName) => importFresh(moduleName);
global.clearModule = (moduleName) => clearModule(moduleName);
global.startMockRequire = (moduleName, replacement) => mockRequire(moduleName, replacement);
global.stopMockRequire = (moduleName) => mockRequire.stop(moduleName);

global.refreshPage = async (browser, visitPath) => {
  await browser.visit(visitPath);
};

global.generateAnonUserIdent = () => {
  const now = new Date();
  return {
    userIdent: {
      id: '0',
      name: 'Anonymous',
      username: 'anon',
      created: now,
      expiry: new Date(now.getTime() + 60000),
      roles: ['default'],
    },
    holidayManager: holidayManagerGenerator(Divisions.ENGLAND_AND_WALES),
    anonymous: true,
  };
};

global.generateAdminUserIdent = () => {
  const now = new Date();
  return {
    userIdent: {
      id: '1',
      name: 'admin',
      username: 'admin',
      created: now,
      expiry: new Date(now.getTime() + 60000),
      roles: ['administrator'],
    },
    holidayManager: holidayManagerGenerator(Divisions.ENGLAND_AND_WALES),
    anonymous: false,
  };
};
