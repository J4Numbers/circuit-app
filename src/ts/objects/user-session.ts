import { Identity } from './identity';

interface SessionTimers {
  expiry: Date,
  created: Date,
}

export type UserSession = Identity & SessionTimers;
