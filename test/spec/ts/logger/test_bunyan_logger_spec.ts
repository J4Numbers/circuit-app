import { expect } from 'chai';

import importFresh = require('import-fresh');
import Logger = require('bunyan');

describe('The bunyan logger module', function () {
  it('Should return a logger on demand', function () {
    const logger = (importFresh('../../../../src/ts/logger/bunyan-logger') as any)
      .default();
    expect(logger).to.be.an.instanceOf(Logger);
  });

  it('Should return the same logger on multiple calls', function () {
    const loggerResolver = importFresh('../../../../src/ts/logger/bunyan-logger') as any;
    const loggerFirst = loggerResolver.default();
    const loggerSecond = loggerResolver.default();
    const loggerThird = loggerResolver.default();
    expect(loggerFirst).to.be.an.instanceOf(Logger);
    expect(loggerSecond).to.be.an.instanceOf(Logger);
    expect(loggerThird).to.be.an.instanceOf(Logger);
    expect(loggerFirst).to.deep.equal(loggerSecond);
    expect(loggerFirst).to.deep.equal(loggerThird);
  });
});
