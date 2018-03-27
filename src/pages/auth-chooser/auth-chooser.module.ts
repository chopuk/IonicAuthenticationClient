import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthChooserPage } from './auth-chooser';

@NgModule({
  declarations: [
    AuthChooserPage,
  ],
  imports: [
    IonicPageModule.forChild(AuthChooserPage),
  ],
})
export class AuthChooserPageModule {}
