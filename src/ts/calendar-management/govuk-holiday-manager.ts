import axios from 'axios';
import moment from 'moment';
import { BankHolidaysResponse } from '../objects/calendar/BankHolidaysResponse';
import { HolidayDays } from '../objects/calendar/HolidayDays';
import { BankHolidays } from '../objects/calendar/BankHolidays';
import Divisions from '../objects/calendar/divisions';
import StandardHolidayManager from './standard-holiday-manager';
import Logger from '../logger/bunyan-logger';

const log = Logger();

/**
 * GovUK implementation of the holiday manager.
 */
export default class GovukHolidayManager extends StandardHolidayManager {
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
  // eslint-disable-next-line class-methods-use-this
  protected async getAllBankHolidays(division: Divisions, year: number): Promise<HolidayDays> {
    try {
      let bankHolidays: HolidayDays = [];
      log.debug('Calling out to retrieve bank holidays from GovUK...');
      const { data }: { data: BankHolidaysResponse } = await axios.get('https://www.gov.uk/bank-holidays.json');
      if (Object.keys(data).includes(division)) {
        const divisionHolidays: BankHolidays = data[division] as BankHolidays;
        bankHolidays = divisionHolidays.events
          .map((holidayDay) => ({
            ...holidayDay,
            date: moment(holidayDay.date),
          }))
          .filter((holidayDay) => holidayDay.date.year() === year);
        log.debug(`Found ${bankHolidays.length} bank holidays within ${division} for the year ${year}`);
      }
      return bankHolidays;
    } catch (e) {
      log.warn(`Unable to return a list of all bank holidays from GovUK - ${e}`);
      return [];
    }
  }
}
