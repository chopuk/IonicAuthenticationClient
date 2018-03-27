import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupPassportPage } from './signup-passport';

@NgModule({
  declarations: [
    SignupPassportPage
  ],
  imports: [
    IonicPageModule.forChild(SignupPassportPage)
  ],
  exports: [
    SignupPassportPage
  ],
})
export class SignupPassportPageModule {}
