import moment, { Moment } from 'moment';
import { HolidayDay, HolidayDays } from '../objects/calendar/HolidayDays';
import Divisions from '../objects/calendar/divisions';
import Logger from '../logger/bunyan-logger';

const log = Logger();

/**
 * The holiday manager exists to keep track of all holidays that can
 * occur within a year for a typical working adult within the UK.
 *
 * @abstract
 */
export default abstract class StandardHolidayManager {
  private readonly promiseProtection: Promise<void | Array<HolidayDays>>;

  private allHolidays: HolidayDays = [];

  /**
   * Load the all holidays default set of data with weekends and holidays.
   *
   * @param {Divisions} division - The division of the UK to generate
   * holidays for.
   * @param {number} year - The year to track the holidays and weekends
   * for.
   */
  constructor(division: Divisions, year: number) {
    this.promiseProtection = Promise.all([
      this.getAllWeekends(year),
      this.getAllBankHolidays(division, year),
    ]).then(([weekends, holidays]) => {
      this.allHolidays = [...weekends, ...holidays].sort((a, b) => {
        if (a.date.isSameOrAfter(b.date)) {
          if (a.date.isSame(b.date)) {
            return 0;
          }
          return 1;
        }
        return -1;
      });
    });
  }

  /**
   * Return a list of all bank holidays within a given year for a division of the UK.
   *
   * @param {Divisions} division - A part of the UK - either 'england-and-wales', 'scotland',
   * or 'northern-ireland'.
   * @param {number} year - The year to scan for holidays within.
   * @returns {Promise<HolidayDays>} The list of all holiday days within a given year
   * for a given division of the UK.
   * @protected
   */
  protected abstract getAllBankHolidays(division: Divisions, year: number): Promise<HolidayDays>;

  /**
   * Load a list of all Saturdays and Sundays within a given year.
   *
   * @param {number} year - The year to look up all the weekends within.
   * @returns {Promise<HolidayDays>} - The list of all weekends within
   * a given year.
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  protected async getAllWeekends(year: number): Promise<HolidayDays> {
    const weekends: HolidayDays = [];
    const dateToLookup = new Date(`01-01-${year}`);
    do {
      if (dateToLookup.getDay() === 0 || dateToLookup.getDay() === 6) {
        weekends.push({
          title: 'Weekend',
          date: moment({
            day: dateToLookup.getDate(),
            month: dateToLookup.getMonth(),
            year: dateToLookup.getFullYear(),
          }),
          notes: 'weekend',
          bunting: false,
        });
      }
      dateToLookup.setTime(dateToLookup.getTime() + (1000 * 60 * 60 * 24));
    } while (dateToLookup.getFullYear() === year);
    log.debug(`Found ${weekends.length} weekend days within ${year}`);
    return weekends;
  }

  /**
   * Return a list of all holidays associated with this object.
   *
   * @returns {Promise<HolidayDays>} A list of all holidays registered to
   * this object.
   */
  public async getAllHolidays(): Promise<HolidayDays> {
    await this.promiseProtection;
    return this.allHolidays;
  }

  /**
   * Add a new holiday to the holiday calendar.
   *
   * @param {HolidayDay} dayToAdd - The day to add to the calendar.
   * @returns {Promise<void>} A successful promise on completion.
   */
  public async addNewHoliday(dayToAdd: HolidayDay): Promise<void> {
    await this.promiseProtection;
    if (this.allHolidays.filter((holidayDay) => holidayDay.date.isSame(dayToAdd.date, 'day')).length > 0) {
      throw new Error('Day to add already exists in calendar management');
    }
    this.allHolidays.push(dayToAdd);
  }

  /**
   * Remove a single holiday from the holiday calendar.
   *
   * @param {string} dayToRemove - The date to remove from the calendar.
   * @returns {Promise<void>} A successful promise on completion.
   */
  public async removeOneHoliday(dayToRemove: Moment): Promise<void> {
    await this.promiseProtection;
    if (this.allHolidays.filter((holidayDay) => holidayDay.date.isSame(dayToRemove, 'day')).length === 0) {
      throw new Error('Day to remove does not exist in calendar management');
    }
    this.allHolidays = this.allHolidays
      .filter((holidayDay) => !holidayDay.date.isSame(dayToRemove, 'day'));
  }
}
