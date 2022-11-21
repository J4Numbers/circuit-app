import { expect } from 'chai';
import { ImportMock } from 'ts-mock-imports';
import importFresh = require('import-fresh');

import MemorySessionManager, * as memorySessionManagerModule from '../../../../src/ts/session-management/memory-session-manager';

const sessionIndexPath = '../../../../src/ts/session-management/';

const importFreshSessionIndex = (): any => (importFresh(sessionIndexPath) as any);

describe('The session management index', function () {
  beforeEach(function () {
    ImportMock.mockClass(memorySessionManagerModule, 'default');
  });

  afterEach(function () {
    ImportMock.restore();
  });

  it('Should return an instance of a authorisation checker', function () {
    expect(importFreshSessionIndex().default()).to.be.an.instanceOf(MemorySessionManager);
  });

  it('Should return the same instance on repeated calls', function () {
    const sessionIndex = importFreshSessionIndex();
    const firstSessionConcretion = sessionIndex.default();
    const secondSessionConcretion = sessionIndex.default();
    expect(firstSessionConcretion).to.deep.equal(secondSessionConcretion);
  });
});
