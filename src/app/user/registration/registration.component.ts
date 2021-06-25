import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  user! : User;
  registerForm!: FormGroup;
  constructor(private fb: FormBuilder,
              public router: Router,
              private userService : UserService,
              private toastr : ToastrService) { }

  ngOnInit() {
    this.validation();
  }

  validation(){
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      fullname: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  register() {
    if(this.registerForm.valid) {
      this.user = this.registerForm.value;
      this.registerUser(this.user);
    }
  }

  registerUser(user : User) {
    this.userService.Register(user).subscribe(
      (_user : User) => {
        this.user = _user;
        this.toastr.warning("Usuario cadastrado com sucesso!", "Sucesso!");
      }, error => {
        this.toastr.warning("Ocorreu um erro ao realizar o cadastro!");
      }
    );
  }

}
