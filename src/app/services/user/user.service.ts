import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  user!: User;

  getUser( id : number) : Observable<User> {
    const token = new HttpHeaders({'Authorization' : `Bearer ${localStorage.getItem('token')}`});
    return this.http.get<User>(`${this.baseURL}/${id}`, { headers: token });
  }

  Login(user : User) {
    return this.http
      .post<Token>(`${this.baseURL}/login`, user)
      .pipe(
        map((response : any) => {
          const token = response;
          if(token) {
            localStorage.setItem('token', token.accessToken);
            this.decodedToken = this.jwtHelper.decodeToken(token.accessToken);

            let nome = 'Usuário';
            this.user = token.user;
            if (this.user != null || this.user != undefined) {
              nome = this.user.fullName.split(" ")[0];
              localStorage.setItem('name', nome.substr(0,1).toUpperCase() + nome.substr(1).toLowerCase());
              localStorage.setItem('id', this.user.id.toString());
            }
            localStorage.setItem('name', nome);

          }
        })
      );
  }

  Register(user : User) : Observable<User> {
    return this.http.post<User>(`${this.baseURL}/register`, user);
  }

  Update(user : User) : Observable<User> {
    const token = new HttpHeaders({'Authorization' : `Bearer ${localStorage.getItem('token')}`});
    return this.http.put<User>(`${this.baseURL}`, user, { headers: token });
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
    localStorage.removeItem('id');
    localStorage.removeItem('name');
  }
}
