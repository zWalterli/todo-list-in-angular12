export interface User {
  userId : number;
  userName : string;
  password : string;
  fullName : string;
  refreshToken : Date;
  refreshTokenExpiryTime : Date;
}
