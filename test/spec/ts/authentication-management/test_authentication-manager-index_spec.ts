import { expect } from 'chai';
import { ImportMock } from 'ts-mock-imports';
import importFresh = require('import-fresh');

import UsernamePasswordAuthenticationManager, * as usernamePasswordAuthManager from '../../../../src/ts/authentication-management/username-password-authentication-manager';

const authIndexPath = '../../../../src/ts/authentication-management/';

const importFreshAuthIndex = (): any => (importFresh(authIndexPath) as any);

describe('The authentication management index', function () {
  beforeEach(function () {
    ImportMock.mockClass(usernamePasswordAuthManager, 'default');
  });

  afterEach(function () {
    ImportMock.restore();
  });

  it('Should return an instance of an authentication manager', function () {
    process.env.NODE_CONFIG = JSON.stringify(require('../../../../config/test'));
    importFresh('config');
    expect(importFreshAuthIndex().default())
      .to.be.an.instanceOf(UsernamePasswordAuthenticationManager);
  });

  it('Should return the same instance on repeated calls', function () {
    const authIndex = importFreshAuthIndex();
    const firstAuthhConcretion = authIndex.default();
    const secondAuthConcretion = authIndex.default();
    expect(firstAuthhConcretion).to.deep.equal(secondAuthConcretion);
  });
});
