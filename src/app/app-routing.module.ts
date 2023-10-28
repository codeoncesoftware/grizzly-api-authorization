import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AuthResolver } from './shared/resolvers/auth.resolver';
import { ResetPasswordResolver } from './shared/resolvers/reset-password.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
      path : 'login',
      component : SignInComponent
  },
  { path: 'confirm/email/:token', component: SignInComponent, resolve: { authResolver: AuthResolver } },

  {
      path : 'sign-up',
      component : SignUpComponent
  },
  { path: 'reset/:token', component: ResetPasswordComponent, resolve: {active : ResetPasswordResolver} },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
  providers: [AuthResolver , ResetPasswordResolver]
})

export class AppRoutingModule { }
