import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFireList,
  AngularFireDatabase,
} from '@angular/fire/compat/database';
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
    return snapshot.exists(); // ritorna true se l'username già esiste, altrimenti false
  }

  async signUp(email: string, password: string, username: string) {
    try {
      const isUsernameTaken = await this.isUsernameTaken(username);

      if (isUsernameTaken) {
        throw new Error('Username già in uso');
      }

      const data = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const user = data.user;

      await user
        ?.updateProfile({
          displayName: username,
        })
        .then(() => {
          console.log(`profilo aggiornato, username: ${user.displayName}`);
        })
        .catch((error) => {
          console.log(error);
        });

      return user;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email già in uso ');
      } else {
        console.error(error);
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
        throw new Error('Utente non trovato');
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  logout() {
    this.auth
      .signOut()
      .then(() => {
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
      })
      .catch((err) => console.log(err));
  }

  userIsLoggedIn() {
    if (localStorage.getItem('user')) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }

  getCurrentUser() {
    return this.auth.authState;
  }
}
