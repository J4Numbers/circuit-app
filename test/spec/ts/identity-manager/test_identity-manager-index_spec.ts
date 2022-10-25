import { expect } from 'chai';
import importFresh = require('import-fresh');

import MemoryIdentityManager from '../../../../src/ts/identity-management/memory-identity-manager';
import StandardIdentityManager from '../../../../src/ts/identity-management/standard-identity-manager';

const identityIndexPath = '../../../../src/ts/identity-management/';

const importFreshIdentityIndex = (): any => (importFresh(identityIndexPath) as any);

describe('The identity management index', function () {
  it('Should return an instance of a MemoryIdentityManager', function () {
    process.env.NODE_CONFIG = JSON.stringify(require('../../../../config/test'));
    importFresh('config');
    expect(importFreshIdentityIndex().default()).to.be.an.instanceOf(MemoryIdentityManager);
  });

  it('Should return an instance of a StandardIdentityManager', function () {
    process.env.NODE_CONFIG = JSON.stringify(require('../../../../config/test'));
    importFresh('config');
    const config = require('config');
    config.identity.source = 'internal';
    expect(importFreshIdentityIndex().default()).to.be.an.instanceOf(StandardIdentityManager);
  });

  it('Should return the same instance on repeated calls', function () {
    process.env.NODE_CONFIG = JSON.stringify(require('../../../../config/test'));
    const identityIndex = importFreshIdentityIndex();
    const firstIdentityConcretion = identityIndex.default();
    const secondIdentityConcretion = identityIndex.default();
    expect(firstIdentityConcretion).to.deep.equal(secondIdentityConcretion);
  });
});
