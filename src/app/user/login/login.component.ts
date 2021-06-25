import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  Token! : Token;
  User! : User;
  loginForm!: FormGroup;
  constructor(public router: Router,
              private fb: FormBuilder,
              private userService : UserService,
              private toastr : ToastrService) { }

  ngOnInit() {
    this.validation();
  }

  validation(){
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  logar() {
    if(this.loginForm.valid) {
      this.User = this.loginForm.value;
      this.Login(this.User);
    }
  }

  Login(user : User) {
    return this.userService.Login(user).subscribe(
      () => {
        this.toastr.success( "Bem vindo! :)", "Sucesso!");
      }, error => {
        this.toastr.warning("Não foi possível logar :(");
      }
    );
  }

}
