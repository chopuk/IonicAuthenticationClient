import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPassportPage } from './login-passport';
import { HomePageModule } from '../home/home.module';

@NgModule({
  declarations: [
    LoginPassportPage
  ],
  imports: [
    IonicPageModule.forChild(LoginPassportPage),
    HomePageModule
  ],
  exports: [
    LoginPassportPage
  ],
})
export class LoginPassportPageModule {}
