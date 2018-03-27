import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginAuth0Page } from './login-auth0';
import { HomePageModule } from '../home/home.module';

@NgModule({
  declarations: [
    LoginAuth0Page,
  ],
  imports: [
    IonicPageModule.forChild(LoginAuth0Page),
    HomePageModule
  ],
})
export class LoginAuth0PageModule {}
