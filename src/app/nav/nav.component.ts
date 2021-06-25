import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(private userService : UserService,
              private router : Router) { }

  ngOnInit() {
  }

  loggedIn() : boolean {
    return this.userService.loggedIn();
  }

  deslogar() {
    this.userService.deslogar();
    this.router.navigate(['/user/login']);
  }

}
