import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { CartProvider } from '../../providers/cart/cart';
import { Observable } from 'rxjs';

import { GlobalsModule } from '../../globals/globals.module';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  cart: any;
  items: any;
  cartObservable: Observable<any[]>
  errorMessage: any;
  url: string;
  noCart: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public cartProvider: CartProvider,
              public globals: GlobalsModule) {
                this.url = this.globals.value.url;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
    this.getCart();
  }

  getCart() {
    this.cartObservable = this.cartProvider.getCart();
    this.cartObservable.subscribe(
      cart => {
        if (cart == null) {
          this.noCart = true;
        } else {
          this.noCart = false;
          this.cart = cart;
          this.items = this.cart.items;
        }
      },
      error => this.errorMessage = <any>error
    )
  }

  removeOne(e,book){
    e.stopPropagation(); // stops item list trigger
    this.cartObservable = this.cartProvider.removeFromCart(book);
    this.cartObservable.subscribe(
      cart => {
        var searchItem = book.bookId;
        var index = -1;
        for(var i = 0, len = this.cart.items.length; i < len; i++) {
            if (this.cart.items[i].bookId === searchItem) {
                index = i;
                break;
            }
        }
        if ( index != -1) {
            if (this.cart.items[index].quantity == 1) {
              this.cart.itemsCount = this.cart.itemsCount - 1;
              this.cart.total = this.roundToTwo( this.cart.total - this.cart.items[index].price);
              this.cart.totalInteger = this.toInteger(this.cart.total * 100);
              this.cart.items.splice(index,1);
              if (this.cart.items.length == 0) {
                this.noCart = true;
              }
            } else {
              this.cart.items[index].quantity = this.cart.items[index].quantity - 1;
              this.cart.items[index].total = this.roundToTwo(this.cart.items[index].total - this.cart.items[index].price);
              this.cart.items[index].instock = this.cart.items[index].instock + 1;
              this.cart.itemsCount = this.cart.itemsCount - 1;
              this.cart.total = this.roundToTwo( this.cart.total - this.cart.items[index].price);
              this.cart.totalInteger = this.toInteger(this.cart.total * 100);
            }
                                  
        }
      },
      error => this.errorMessage = <any>error
    )
  }

  addAnotherOne(e,book){
    e.stopPropagation(); // stops item list trigger
    this.cartObservable = this.cartProvider.addToCart(book,book.bookId);
    this.cartObservable.subscribe(
      cart => {
        var searchItem = book.bookId;
        var index = -1;
        for(var i = 0, len = this.cart.items.length; i < len; i++) {
            if (this.cart.items[i].bookId === searchItem) {
                index = i;
                break;
            }
        }
        if ( index != -1) {
            this.cart.items[index].quantity = this.cart.items[index].quantity + 1;
            this.cart.items[index].total = this.roundToTwo(this.cart.items[index].total + this.cart.items[index].price);
            this.cart.items[index].instock = this.cart.items[index].instock - 1;

            this.cart.itemsCount = this.cart.itemsCount + 1;
            this.cart.total = this.roundToTwo( this.cart.total + this.cart.items[index].price); 
            this.cart.totalInteger = this.toInteger(this.cart.total * 100);                     
        }
      },
      error => this.errorMessage = <any>error
    )
  }

  checkOut() {
    this.navCtrl.push('CheckoutPage', {cart: this.cart});
  }

  checkQty(item) {    
    return (item.instock <= 0)
  }

  roundToTwo(num) {    
    return (Math.round(num * 100)  / 100);
  }

  toInteger(number){ 
    return Math.round(  // round to nearest integer
      Number(number)    // type cast your input
    ); 
  };

}
