import { BankHolidays } from './BankHolidays';
import Divisions from './divisions';

export type BankHolidaysResponse = {
  [key in Divisions]?: BankHolidays;
};
