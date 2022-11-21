import { UserSession } from './user-session';
import { ToastDetails } from './toast-details';
import StandardHolidayManager from '../calendar-management/standard-holiday-manager';

export interface SessionOptions {
  userIdent?: UserSession,
  anonymous?: Boolean,
  holidayManager?: StandardHolidayManager,
  toasts?: Array<ToastDetails>
}
