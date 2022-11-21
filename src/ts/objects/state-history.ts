/* eslint-disable camelcase */
import TicketState from './ticket-state';

export interface StateHistory {
  state: TicketState,
  effective_from: Date,
}
