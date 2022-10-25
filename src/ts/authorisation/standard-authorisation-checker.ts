import ActionEnums from '../objects/action-enums';
import { UserSession } from '../objects/user-session';

/**
 * A standardised interface for checking whether a given user session is
 * allowed to perform a specific action.
 */
export default abstract class StandardAuthorisationChecker {
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
  abstract isAuthorised(
    userSession: UserSession | undefined, action: ActionEnums): Promise<boolean>;
}
