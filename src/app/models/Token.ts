export interface Token {
  authenticated : boolean;
  created : string;
  expiration : string;
  accessToken : string;
  refreshToken : string;
}
