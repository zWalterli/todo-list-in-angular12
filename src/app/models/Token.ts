import { User } from "./User";

export interface Token {
  authenticated : boolean;
  created : string;
  expiration : string;
  accessToken : string;
  refreshToken : string;
  user : User;
}
