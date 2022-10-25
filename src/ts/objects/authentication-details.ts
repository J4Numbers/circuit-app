export interface UsernamePassword {
  username: string,
  password: string,
}

export interface OIDCResponse {
  accessToken: string,
  userClaims: string,
  identity?: string,
}

export interface SamlToken {
  saml: string,
}

export type AuthenticationDetails = UsernamePassword | OIDCResponse | SamlToken;
