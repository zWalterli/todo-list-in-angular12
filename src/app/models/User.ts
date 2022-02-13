export interface User {
  id : number;
  userName : string;
  password : string;
  fullName : string;
  refreshToken : Date;
  refreshTokenExpiryTime : Date;
}
