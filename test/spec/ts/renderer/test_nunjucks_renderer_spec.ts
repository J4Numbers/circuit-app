import { expect } from 'chai';
import { Environment } from 'nunjucks';

import importFresh = require('import-fresh');

describe('The nunjucks renderer module', function () {
  it('Should return a nunjucks environment on demand', function () {
    const nunjucksEnv = (importFresh('../../../../src/ts/renderer/nunjucks-renderer') as any)
      .default();
    expect(nunjucksEnv).to.be.an.instanceOf(Environment);
  });

  it('Should return the same renderer on multiple calls', function () {
    const rendererResolver = importFresh('../../../../src/ts/renderer/nunjucks-renderer') as any;
    const rendererFirst = rendererResolver.default();
    const rendererSecond = rendererResolver.default();
    const rendererThird = rendererResolver.default();
    expect(rendererFirst).to.be.an.instanceOf(Environment);
    expect(rendererSecond).to.be.an.instanceOf(Environment);
    expect(rendererThird).to.be.an.instanceOf(Environment);
    expect(rendererFirst).to.deep.equal(rendererSecond);
    expect(rendererFirst).to.deep.equal(rendererThird);
  });
});
