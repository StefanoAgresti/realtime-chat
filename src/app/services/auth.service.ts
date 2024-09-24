import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase
  ) {}

  async isUsernameTaken(username: string) {
    const snapshot = await this.db.database
      .ref('users')
      .orderByChild('username')
      .equalTo(username)
      .once('value');
    return snapshot.exists(); //return true if username already exists, else return false
  }

  async signUp(email: string, password: string, username: string) {
    try {
      const isUsernameTaken = await this.isUsernameTaken(username);

      if (isUsernameTaken) {
        throw new Error('Username already taken');
      }

      const data = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );

      const user = data?.user;

      await user
        ?.updateProfile({
          displayName: username,
        })
        .then(() => {
          console.log(`profile updated, username: ${user.displayName}`);
        })
        .catch((error: Error) => {
          console.log(error);
        });

      return user;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email already taken');
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const data = await this.auth.signInWithEmailAndPassword(email, password);
      const user = data.user;

      return user;
    } catch (error: any) {
      if (error.code === 'auth/invalid-login-credentials') {
        throw new Error('User not found. Check your email and password');
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  logout() {
    this.auth
      .signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((err) => console.log(err));
  }

  getCurrentUser() {
    return this.auth.authState;
  }
}
