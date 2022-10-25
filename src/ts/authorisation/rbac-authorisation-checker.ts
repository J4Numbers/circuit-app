import StandardAuthorisationChecker from './standard-authorisation-checker';
import { UserSession } from '../objects/user-session';
import ActionEnums from '../objects/action-enums';
import Logger from '../logger/bunyan-logger';

const log = Logger();

/**
 * A Role-Based implementation of the authorisation checker which uses
 * the config data to make authorisation decisions.
 *
 * @implements {StandardAuthorisationChecker}
 */
export default class RbacAuthorisationChecker extends StandardAuthorisationChecker {
  /**
   * The RBAC instance to control authorisation.
   *
   * @private
   */
  private authData: {
    [role: string]: { extends?: string, allow? : string[], deny? : string[] },
  };

  /**
   * Constructor for RbacAuthorisationChecker which takes the authorisation data
   * which will be used to make auth decisions.
   *
   * @param {Array} data
   * - The authorisation data.
   */
  constructor(data: {[role: string]: { extends?: string, allow? : string[], deny? : string[] }}) {
    super();
    this.authData = data;
  }

  /**
   * Check whether a given user session is allowed to perform a specific
   * action.
   *
   * @param {UserSession} userSession - The user session to test the authorisation
   * of.
   * @param {ActionEnums} action - The specific action that the user is trying
   * to perform.
   * @returns {Promise<boolean>} Whether the user is allowed to perform the given
   * action or not.
   */
  // eslint-disable-next-line class-methods-use-this
  async isAuthorised(userSession: UserSession | undefined, action: ActionEnums): Promise<boolean> {
    if (userSession === undefined || (userSession.expiry.getTime() <= new Date().getTime())) {
      log.debug('userSession undefined or expired');
      return false;
    }

    const authorisedRole = userSession.roles?.find((role) => this.isRoleAuthorised(role, action));
    log.debug(`authorisedRole ${authorisedRole}`);
    return authorisedRole !== undefined;
  }

  /**
   * Check whether a given role is allowed to perform a specific
   * action. If the supplied role extends another then iteratively
   * check the extended role for authorisation.
   *
   * @param {string} role - The role to authorise.
   * @param {ActionEnums} action - The specific action that the user is trying
   * to perform.
   * @returns {Promise<boolean>} Whether the user is allowed to perform the given
   * action or not.
   */
  // eslint-disable-next-line class-methods-use-this
  private isRoleAuthorised(role: string, action: ActionEnums): boolean {
    let authorised = false;
    const data = this.authData[role];
    if (data !== undefined) {
      if (data.deny?.includes(action)) {
        authorised = false;
      } else if (data.allow?.includes(action)) {
        authorised = true;
      } else if (data.extends !== undefined) {
        log.debug(`Role ${role} extends ${data.extends}`);
        authorised = this.isRoleAuthorised(data.extends, action);
      }
    }
    log.debug(`Auth: Returning ${authorised} for role '${role}', action ${action}`);
    return authorised;
  }
}
