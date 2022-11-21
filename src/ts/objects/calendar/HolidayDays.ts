import { Moment } from 'moment';

export interface HolidayDay {
  'title': string,
  'date': Moment,
  'notes': string,
  'bunting': boolean
}

export type HolidayDays = Array<HolidayDay>;
