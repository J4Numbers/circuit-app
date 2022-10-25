import config from 'config';
import Divisions from '../objects/calendar/divisions';
import StandardHolidayManager from './standard-holiday-manager';
import GovukHolidayManager from './govuk-holiday-manager';

/**
 * Resolve the holiday manager that we want to use for the installation of
 * this application.
 *
 * @param {Divisions} division - The division of the UK to track holidays
 * for.
 * @returns {StandardHolidayManager} The holiday manager that we're going to
 * use for the installation of the app.
 * @throws {Error} - If the application is not configured correctly.
 */
export default (division: Divisions): StandardHolidayManager => {
  const holidaySource = config.get('holiday.source');
  let holidayInst: StandardHolidayManager;

  switch (holidaySource) {
    case 'govuk':
      holidayInst = new GovukHolidayManager(
        division,
        new Date().getFullYear(),
      );
      break;
    default:
      throw new Error(`Invalid config: unknown holiday source ${holidaySource}`);
  }

  return holidayInst;
};
