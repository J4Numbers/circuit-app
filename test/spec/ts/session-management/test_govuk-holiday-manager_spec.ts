import nock = require('nock');
import { expect } from 'chai';
import moment from 'moment';
import { HolidayDay } from '../../../../src/ts/objects/calendar/HolidayDays';
import Divisions from '../../../../src/ts/objects/calendar/divisions';
import GovukHolidayManager from '../../../../src/ts/calendar-management/govuk-holiday-manager';

const calculateWeekendsInAYear = (year: number): number => {
  const dateToLookup = moment(`${year}-01-01`, 'YYYY-MM-DD');
  let count = 0;
  do {
    if (dateToLookup.day() === 0 || dateToLookup.day() === 6) {
      count += 1;
    }
    dateToLookup.add(1, 'day');
  } while (dateToLookup.year() === year);
  return count;
};

const calculateFirstNonWeekendInAYear = (year: number): string => {
  const dateToLookup = moment(`${year}-01-01`, 'YYYY-MM-DD');
  do {
    if (dateToLookup.day() !== 0 && dateToLookup.day() !== 6) {
      return dateToLookup.format('YYYY-MM-DD');
    }
    dateToLookup.add(1, 'day');
  } while (dateToLookup.year() === year);
  return `${year}-01-01`;
};

const convertToApiResponse = (holidayDay: HolidayDay): object => ({
  ...holidayDay,
  date: holidayDay.date.format('YYYY-MM-DD'),
});

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

describe('The govuk holiday manager', function () {
  afterEach(function () {
    nock.cleanAll();
  });

  describe('Loading a new holiday manager', function () {
    it('Should return a list of all weekends when no bank holidays are specified', function () {
      const thisYear = new Date().getFullYear();
      const nockedPath = generateBaseNock()
        .get('/bank-holidays.json')
        .reply(200, generateBaseBankHolidaysMock());

      const holidayManager = new GovukHolidayManager(Divisions.ENGLAND_AND_WALES, thisYear);

      return holidayManager.getAllHolidays()
        .then((holidayDays) => {
          expect(nockedPath.isDone()).to.be.true;
          expect(holidayDays).to.have.lengthOf(calculateWeekendsInAYear(thisYear));
        });
    });

    it('Should include a list of bank holidays to the default list', function () {
      const thisYear = new Date().getFullYear();
      const nonWeekend = calculateFirstNonWeekendInAYear(thisYear);

      const nockedPath = generateBaseNock()
        .get('/bank-holidays.json')
        .reply(200, {
          'england-and-wales': {
            division: 'england-and-wales',
            events: [
              {
                title: 'A test day',
                date: nonWeekend,
                notes: 'Test day',
                bunting: false,
              },
            ],
          },
        });
      const holidayManager = new GovukHolidayManager(Divisions.ENGLAND_AND_WALES, thisYear);

      return holidayManager.getAllHolidays()
        .then((holidays) => {
          expect(nockedPath.isDone()).to.be.true;
          expect(
            holidays.filter((holiday) => holiday.date.isSame(nonWeekend)),
          ).to.have.lengthOf(1);
        });
    });
  });

  describe('Adding a new holiday to the manager', function () {
    it('should add a new holiday if the day does not already exist', function () {
      const thisYear = new Date().getFullYear();
      const dateToAdd = calculateFirstNonWeekendInAYear(thisYear);

      const nockedPath = generateBaseNock()
        .get('/bank-holidays.json')
        .reply(200, generateBaseBankHolidaysMock());
      const holidayManager = new GovukHolidayManager(Divisions.ENGLAND_AND_WALES, thisYear);

      return holidayManager.addNewHoliday({
        title: 'Day to add',
        date: moment(dateToAdd),
        notes: 'A new day to add',
        bunting: false,
      })
        .then(() => holidayManager.getAllHolidays())
        .then((holidays) => {
          expect(nockedPath.isDone()).to.be.true;
          expect(
            holidays.filter((holiday) => holiday.date.isSame(dateToAdd)),
          ).to.have.lengthOf(1);
        });
    });

    it('should fail when attempting to re-add a holiday which already exists', function () {
      const thisYear = new Date().getFullYear();
      const addedDay = calculateFirstNonWeekendInAYear(thisYear);
      const holidayDay: HolidayDay = {
        title: 'A test day',
        date: moment(addedDay),
        notes: 'Test day',
        bunting: false,
      };

      const nockedPath = generateBaseNock()
        .get('/bank-holidays.json')
        .reply(200, {
          'england-and-wales': {
            division: 'england-and-wales',
            events: [convertToApiResponse(holidayDay)],
          },
        });
      const holidayManager = new GovukHolidayManager(Divisions.ENGLAND_AND_WALES, thisYear);

      return holidayManager.addNewHoliday(holidayDay)
        .then(() => expect(true).to.be.false)
        .catch((e) => {
          expect(nockedPath.isDone()).to.be.true;
          expect(e.message).to.equal('Day to add already exists in calendar management');
        });
    });
  });

  describe('Removing a holiday from the manager', function () {
    it('should remove a holiday which exists within the manager when found', function () {
      const thisYear = new Date().getFullYear();
      const dayToRemove = calculateFirstNonWeekendInAYear(thisYear);
      const holidayDay: HolidayDay = {
        title: 'A test day to remove',
        date: moment(dayToRemove),
        notes: 'Test day to remove',
        bunting: false,
      };

      const nockedPath = generateBaseNock()
        .get('/bank-holidays.json')
        .reply(200, {
          'england-and-wales': {
            division: 'england-and-wales',
            events: [convertToApiResponse(holidayDay)],
          },
        });
      const holidayManager = new GovukHolidayManager(Divisions.ENGLAND_AND_WALES, thisYear);

      return holidayManager.removeOneHoliday(moment(dayToRemove))
        .then(() => holidayManager.getAllHolidays())
        .then((holidays) => {
          expect(nockedPath.isDone()).to.be.true;
          expect(
            holidays.filter((holiday) => holiday.date.isSame(dayToRemove)),
          ).to.have.lengthOf(0);
        });
    });

    it('should fail if the holiday to be removed did not exist within the manager', function () {
      const thisYear = new Date().getFullYear();
      const dayToRemove = calculateFirstNonWeekendInAYear(thisYear);

      const nockedPath = generateBaseNock()
        .get('/bank-holidays.json')
        .reply(200, generateBaseBankHolidaysMock());
      const holidayManager = new GovukHolidayManager(Divisions.ENGLAND_AND_WALES, thisYear);

      return holidayManager.removeOneHoliday(moment(dayToRemove))
        .then(() => expect(true).to.be.false)
        .catch((e) => {
          expect(nockedPath.isDone()).to.be.true;
          expect(e.message).to.equal('Day to remove does not exist in calendar management');
        });
    });
  });
});
