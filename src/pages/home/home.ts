import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, IonicPage, Events, ToastController } from 'ionic-angular';
import { LibraryProvider } from '../../providers/library/library';
import { Observable } from 'rxjs';

import { GlobalsModule } from '../../globals/globals.module';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  books: any;
  booksObservable: Observable<any[]>;
  loading: any;
  errorMessage: any;
  url: string;
  searchTerm: string;
  filteredBooks: any;
  categories: any;

  constructor(public navCtrl: NavController, 
              public bookService: LibraryProvider, 
              public alertController: AlertController, 
              public events: Events, 
              public loadingController: LoadingController,
              public toastController: ToastController,
              public globals: GlobalsModule) {
      this.url = this.globals.value.url;
      this.events.subscribe('database:refresh', (data) => {
        this.getCategories();
        this.getBooks();
      });
  }

  getBooks() {
    this.booksObservable = this.bookService.getBooks();
    this.booksObservable.subscribe(
      books => {
        this.books = books;
        this.filteredBooks = books;
      },
      error => this.errorMessage = <any>error
    )
  }

  getCategories() {
    this.booksObservable = this.bookService.getCategories();
    this.booksObservable.subscribe(
      categories => {
        this.categories = categories;
      },
      error => this.errorMessage = <any>error
    )
  }
 
  addBook() {
    this.navCtrl.push('AddUpdateBookPage',{categories: this.categories});
  }

  displayBook(book) {
    this.navCtrl.push('BookDetailsPage', {book: book});
  }

  updateBook(e,book){
    e.stopPropagation(); // stops item list trigger
    this.navCtrl.push('AddUpdateBookPage', {book: book, categories: this.categories});
  }
 
  deleteBook(e,book){

    e.stopPropagation(); // stops item list trigger
    let confirm = this.alertController.create({
      title: 'Delete this book?',
      message: 'Are you sure you want to remove this book from the database?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.showLoader();
 
            //Remove from database
            this.booksObservable = this.bookService.deleteBook(book._id);
            this.booksObservable.subscribe(
              books =>  {
                this.books = books;
                this.filteredBooks = books;
                this.loading.dismiss();
                this.presentToast('Book deleted');
              },
              error => this.errorMessage = <any>error
            );
          }
        },
        {
          text: 'No',
          handler: () => {
            //console.log('No clicked');
          }
        }
      ]
    });

    confirm.present();

  }
 
  showLoader(){
 
    this.loading = this.loadingController.create({
      content: 'Authenticating...'
    });
 
    this.loading.present();
 
  }

  presentToast(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 2000,
      cssClass: 'centerit'
    });
    toast.present();
  }

  setFilteredItems() {
    this.filteredBooks = this.books.filter((book) => {
      return book.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1 || book.category.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1 ;
    });
  }
 
}