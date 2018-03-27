import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginFirebasePage } from './login-firebase';
import { HomePageModule } from '../home/home.module';

@NgModule({
  declarations: [
    LoginFirebasePage,
  ],
  imports: [
    IonicPageModule.forChild(LoginFirebasePage),
    HomePageModule
  ],
})
export class LoginFirebasePageModule {}
