/* eslint-disable camelcase */
import { UserShort } from './user-short';
import { Group } from './group';

export interface User extends UserShort {
  username: string,
  password: string,
  family_name: string,
  given_name: string,
  middle_name: string,
  email: string,
  groups?: Group[],
  createdDate?: Date,
  modifiedDate?: Date,
  enabled?: boolean,
  status?: string,
}
