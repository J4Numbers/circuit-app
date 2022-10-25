export interface Identity {
  id: string,
  accessToken: string,
  username: string,
  name: string,
  roles?: Array<string>,
}
