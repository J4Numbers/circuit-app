import { expect } from 'chai';
import ActionEnums from '../../../../src/ts/objects/action-enums';
import { UserSession } from '../../../../src/ts/objects/user-session';
import RbacAuthorisationChecker from '../../../../src/ts/authorisation/rbac-authorisation-checker';

const generateUserSession = (): UserSession => {
  const now = new Date();
  return {
    id: '1',
    accessToken: '1234567890',
    username: 'adam',
    name: 'Adam',
    created: now,
    expiry: new Date(now.getTime() + 60000),
    roles: [
      'testrole',
    ],
  };
};

const generateRbacData = ():
{[role: string]: { extends?: string, allow? : string[], deny? : string[] }} => ({
  testrole: {
    allow: [
      ActionEnums.VIEW_HOMEPAGE,
    ],
    deny: [
      ActionEnums.VIEW_MANAGER,
    ],
  },
  extendingrole: {
    extends: 'testrole',
    allow: [
      ActionEnums.VIEW_CALENDAR,
      ActionEnums.VIEW_MANAGER,
    ],
    deny: [
      ActionEnums.UPDATE_MANAGER,
      ActionEnums.VIEW_HOMEPAGE,
    ],
  },
});

describe('The rbac authorisation checker', function () {
  it('Should return false if user is undefined', function () {
    const authorisationChecker = new RbacAuthorisationChecker(generateRbacData());
    return expect(authorisationChecker.isAuthorised(
      undefined,
      ActionEnums.VIEW_HOMEPAGE,
    )).to.eventually.be.false;
  });

  it('Should return true if user is provided within expiry', function () {
    const authorisationChecker = new RbacAuthorisationChecker(generateRbacData());
    return expect(authorisationChecker.isAuthorised(
      generateUserSession(),
      ActionEnums.VIEW_HOMEPAGE,
    )).to.eventually.be.true;
  });

  it('Should return false if user is provided after expiry', function () {
    const authorisationChecker = new RbacAuthorisationChecker(generateRbacData());
    const expiredIdent = generateUserSession();
    expiredIdent.expiry = new Date(new Date().getTime() - 60000);
    return expect(authorisationChecker.isAuthorised(
      expiredIdent,
      ActionEnums.VIEW_HOMEPAGE,
    )).to.eventually.be.false;
  });

  it('Should return false if user is not authorised for action', function () {
    const authorisationChecker = new RbacAuthorisationChecker(generateRbacData());
    return expect(authorisationChecker.isAuthorised(
      generateUserSession(),
      ActionEnums.VIEW_CALENDAR,
    )).to.eventually.be.false;
  });

  it('Should return true if user is authorised by role extension', function () {
    const authorisationChecker = new RbacAuthorisationChecker(generateRbacData());
    const user = generateUserSession();
    user.roles = ['extendingrole'];
    return expect(authorisationChecker.isAuthorised(
      user,
      ActionEnums.VIEW_CALENDAR,
    )).to.eventually.be.true;
  });

  it('Should return false if user is denied by role', function () {
    const authorisationChecker = new RbacAuthorisationChecker(generateRbacData());
    const user = generateUserSession();
    return expect(authorisationChecker.isAuthorised(
      user,
      ActionEnums.VIEW_MANAGER,
    )).to.eventually.be.false;
  });

  it('Should return false if user is denied by role extension', function () {
    const authorisationChecker = new RbacAuthorisationChecker(generateRbacData());
    const user = generateUserSession();
    user.roles = ['extendingrole'];
    return expect(authorisationChecker.isAuthorised(
      user,
      ActionEnums.UPDATE_MANAGER,
    )).to.eventually.be.false;
  });

  it('Should return false if user is denied by overriden permission', function () {
    const authorisationChecker = new RbacAuthorisationChecker(generateRbacData());
    const user = generateUserSession();
    user.roles = ['extendingrole'];
    return expect(authorisationChecker.isAuthorised(
      user,
      ActionEnums.VIEW_HOMEPAGE,
    )).to.eventually.be.false;
  });
});
