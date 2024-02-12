import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ChatComponent } from './components/chat/chat.component';

import {
  redirectUnauthorizedTo,
  redirectLoggedInTo,
  canActivate,
} from '@angular/fire/compat/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const redirectLoggedInToChat = () => redirectLoggedInTo(['chat']);

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'login',
    ...canActivate(redirectLoggedInToChat),
    component: LoginComponent,
  },
  {
    path: 'sign-up',
    ...canActivate(redirectLoggedInToChat),
    component: SignUpComponent,
  },
  {
    path: 'chat',
    ...canActivate(redirectUnauthorizedToLogin),
    component: ChatComponent,
  },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
