import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  error!: Error;

  ngOnInit(): void {}

  onSubmit(loginForm: NgForm) {
    const email = loginForm.value.email;
    const password = loginForm.value.password;

    this.authService
      .signIn(email, password)
      .then((user) => {
        if (user) {
          loginForm.reset();
          this.router.navigate(['/chat']);
        } else {
          this.router.navigate(['']);
        }
      })
      .catch((err) => (this.error = err));
  }
}
