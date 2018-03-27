import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddUpdateBookPage } from './add-update-book';


@NgModule({
  declarations: [
    AddUpdateBookPage
  ],
  imports: [
    IonicPageModule.forChild(AddUpdateBookPage)
  ],
})
export class AddUpdateBookPageModule {}
