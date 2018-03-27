import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-success',
  templateUrl: 'success.html',
})
export class SuccessPage {

  cart: any;
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.cart = navParams.get('cart');
    this.user = navParams.get('user');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuccessPage');
  }

  goBack(){
    this.navCtrl.setRoot('LoginPassportPage');
  }
}
