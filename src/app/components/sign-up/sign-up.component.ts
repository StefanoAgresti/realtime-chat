import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import {
  AngularFireList,
  AngularFireDatabase,
} from '@angular/fire/compat/database';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private db: AngularFireDatabase,
    private router: Router
  ) {}

  error!: Error;
  usersDbRef: AngularFireList<any> = this.db.list('users');

  ngOnInit(): void {}

  onSubmit(signUpForm: NgForm) {
    const email = signUpForm.value.email;
    const password = signUpForm.value.password;
    const username = signUpForm.value.username;

    this.authService
      .signUp(email, password, username)
      .then((user) => {
        console.log(user);

        //email & username stored on db
        this.usersDbRef.set(`${user?.uid}`, {
          email: email,
          username: user?.displayName,
        });

        this.router.navigate(['/login']);
        signUpForm.reset();
      })
      .catch((err) => {
        this.error = err;
      });
  }
}
