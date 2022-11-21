import { expect } from 'chai';
import { ImportMock } from 'ts-mock-imports';
import importFresh = require('import-fresh');

import RbacAuthorisationChecker, * as rbacAuthCheckerModule from '../../../../src/ts/authorisation/rbac-authorisation-checker';

const authIndexPath = '../../../../src/ts/authorisation/';

const importFreshAuthIndex = (): any => (importFresh(authIndexPath) as any);

describe('The authorisation checker index', function () {
  beforeEach(function () {
    ImportMock.mockClass(rbacAuthCheckerModule, 'default');
  });

  afterEach(function () {
    ImportMock.restore();
  });

  it('Should return an instance of a authorisation checker', function () {
    expect(importFreshAuthIndex().default()).to.be.an.instanceOf(RbacAuthorisationChecker);
  });

  it('Should return the same instance on repeated calls', function () {
    const authIndex = importFreshAuthIndex();
    const firstAuthConcretion = authIndex.default();
    const secondAuthConcretion = authIndex.default();
    expect(firstAuthConcretion).to.deep.equal(secondAuthConcretion);
  });
});
