import { Component, Input, OnInit } from '@angular/core';
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

  editandoPerfil : boolean = false;
  user! : User;
  registerForm!: FormGroup;
  constructor(private fb: FormBuilder,
              public router: Router,
              private userService : UserService,
              private toastr : ToastrService) { }

  ngOnInit() {
    this.validation();
    this.verificaPerfil();
  }

  preencheForm(user : User) {
    this.registerForm.patchValue({
      id : user.id,
      username: user.userName,
      fullname: user.fullName
    });
  }

  getIdUsuarioByLocalStorage() : any {
    const id = localStorage.getItem('id');
    return (id != null || id != undefined) ? id : null;
  }

  verificaPerfil() {
    const usuarioId = this.getIdUsuarioByLocalStorage();
    if( usuarioId === null ) {
      return;
    }

    this.getUsuario(parseInt(usuarioId));
  }

  getUsuario(usuarioId : number) {
      this.userService.getUser(usuarioId).subscribe(
        (_user : User) => {
          this.user = _user;
          this.editandoPerfil = true;
          this.preencheForm(this.user);
        }, error => {
          this.toastr.warning("Ocorreu um erro ao buscar as informações do usuario!");
        }
      );
  }

  validation(){
    this.registerForm = this.fb.group({
      id: [null],
      username: ['', Validators.required],
      fullname: ['', Validators.required],
      password: []
    });
  }

  private toBase64(str : string) : string {
    return btoa(str);
  }

  salvar() {
    if(this.registerForm.valid) {
      this.user = this.registerForm.value;
      this.user.password = this.toBase64(this.user.password);
      if(!this.editandoPerfil){
        if(this.registerForm.value.password == null || this.registerForm.value.password == undefined) {
          this.toastr.error('Por favor, informe uma senha válida!');
          return;
        }
        this.registerUser(this.user);
      } else {
        this.salvarEdicao(this.user);
      }
    }
  }

  salvarEdicao(user : User) {
    this.userService.Update(user).subscribe(
      (_user : User) => {
        this.user = _user;

        const nome = this.user.fullName.split(" ")[0];
        localStorage.setItem('name', nome.substr(0,1).toUpperCase() + nome.substr(1).toLowerCase());

        this.toastr.success("Usuario atualizado com sucesso!", "Sucesso!");
      }, error => {
        this.toastr.warning("Ocorreu um erro ao realizar a atualização!");
      }
    );
  }

  registerUser(user : User) {
    this.userService.Register(user).subscribe(
      (_user : User) => {
        this.user = _user;
        this.toastr.success("Usuario cadastrado com sucesso!", "Sucesso!");

        // Tento logar na aplicação...
        this.userService.Login(user).subscribe(
          () => {
            this.router.navigate(['tools']);
          }, error => {
            this.toastr.warning(error.error);
          }
        );
      }, error => {
        this.toastr.warning(error.error);
      }
    );
  }

}
