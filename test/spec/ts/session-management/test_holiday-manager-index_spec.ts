import { expect } from 'chai';
import { ImportMock } from 'ts-mock-imports';
import importFresh = require('import-fresh');

import GovukHolidayManager, * as govukHolidayManagerModule from '../../../../src/ts/calendar-management/govuk-holiday-manager';

const holidayIndexPath = '../../../../src/ts/calendar-management/';

const importFreshHolidayIndex = (): any => (importFresh(holidayIndexPath) as any);

describe('The calendar management index', function () {
  beforeEach(function () {
    ImportMock.mockClass(govukHolidayManagerModule, 'default');
  });

  afterEach(function () {
    ImportMock.restore();
  });

  it('Should return an instance of a holiday manager', function () {
    expect(importFreshHolidayIndex().default()).to.be.an.instanceOf(GovukHolidayManager);
  });

  it('Should return different instances on repeated calls', function () {
    const sessionIndex = importFreshHolidayIndex();
    const firstSessionConcretion = sessionIndex.default();
    const secondSessionConcretion = sessionIndex.default();
    expect(firstSessionConcretion).to.not.equal(secondSessionConcretion);
  });
});
