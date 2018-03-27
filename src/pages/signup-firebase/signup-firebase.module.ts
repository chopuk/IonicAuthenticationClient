import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupFirebasePage } from './signup-firebase';

@NgModule({
  declarations: [
    SignupFirebasePage,
  ],
  imports: [
    IonicPageModule.forChild(SignupFirebasePage),
  ],
})
export class SignupFirebasePageModule {}
