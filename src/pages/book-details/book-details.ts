import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { CartProvider } from '../../providers/cart/cart';
import { Observable } from 'rxjs';

import { GlobalsModule } from '../../globals/globals.module';

@IonicPage()
@Component({
  selector: 'page-book-details',
  templateUrl: 'book-details.html',
})
export class BookDetailsPage {

  book: any;
  url: string;
  inventory: string;
  noStock: boolean;
  cartObsevable: Observable<any[]>;
  errorMessage: string;
  notPassport: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public toastController: ToastController,
              public events: Events,
              public cartProvider: CartProvider,
              public globals: GlobalsModule) {
      this.book = navParams.get('book');
      this.inventory = this.book.quantity > 0 ? 'IN STOCK' : 'AWAITING SUPPLIER';
      this.noStock = this.book.quantity > 0 ? false : true;
      this.url = this.globals.value.url;
      this.notPassport = this.globals.value.authType !== 'passport' ? true : false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookDetailsPage');
  }

  addToCart() {
    this.cartObsevable = this.cartProvider.addToCart(this.book,this.book._id);
    this.cartObsevable.subscribe(
      result => {
        let data: any = result;
        console.log('data from add to cart: ' +JSON.stringify(data));
        this.presentToast('Added to cart');
        this.events.publish('database:refresh', 'Refresh Database');
        this.book.quantity = this.book.quantity -1;
        this.inventory = this.book.quantity > 0 ? 'IN STOCK' : 'AWAITING SUPPLIER'
      }, 
      error => this.errorMessage = error
    );
  }

  checkQuantity(quantity: number) {
    if(quantity == 0) {
      return "red";
    } else { // In stock
      return "green";
    }
  }

  presentToast(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 2000,
      cssClass: 'centerit'
    });
    toast.present();
  }

}
