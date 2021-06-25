import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  baseURL = 'http://localhost:3000/api/user';
  jwtHelper = new JwtHelperService();
  decodedToken : any;

  Login(user : User) {
    return this.http
      .post<Token>(`${this.baseURL}/login`, user)
      .pipe(
        map((response : any) => {
          const token = response;
          if(token) {
            localStorage.setItem('token', token.accessToken);

            let nome = 'Usuário';
            if (user.fullName != null || user.fullName != undefined) {
              nome = user.fullName.split(" ")[0];
              localStorage.setItem('name', nome);
            }
            localStorage.setItem('name', nome);

            this.decodedToken = this.jwtHelper.decodeToken(token.accessToken)
          }
        })
      );
  }

  Register(user : User) : Observable<User> {
    return this.http.post<User>(`${this.baseURL}/register`, user);
  }

  loggedIn() {
    const tokenLocalStorage = localStorage.getItem('token');
    if(tokenLocalStorage == null || tokenLocalStorage == undefined){
      return false;
    }
    return !this.jwtHelper.isTokenExpired( tokenLocalStorage! );
  }

  deslogar() {
    localStorage.removeItem('token');
  }
}
