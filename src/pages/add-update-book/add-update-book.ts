import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, LoadingController, ActionSheetController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LibraryProvider } from '../../providers/library/library';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalsModule } from '../../globals/globals.module';

import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';

@IonicPage()
@Component({
  selector: 'page-add-update-book',
  templateUrl: 'add-update-book.html',
})
export class AddUpdateBookPage {

  bookForm : FormGroup;
  book: any;
  buttonText: any
  result: any;
  booksObsevable: Observable<any[]>;
  errorMessage: string;
  pageTitle: string;
  coverText: string;
  categories: any;

  imageData:any;
  imageURI:any;
  imageDataWithoutPrefix:any;
  displayImage: boolean;
  url: any;
  blob: any;
  imageSelected_Data_URL: boolean;
  imageSelected_File_URI: boolean;
  loading: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public formBuilder: FormBuilder, 
              public bookService: LibraryProvider,
              public events: Events,
              public toastController: ToastController,
              public actionSheetController: ActionSheetController,
              public loadingController: LoadingController,
              public camera: Camera,
              public domSanitizer: DomSanitizer,
              public base64: Base64,
              public globals: GlobalsModule) {
    this.book = navParams.get('book');
    this.url = globals.value.url;
    this.categories = navParams.get('categories');
    this.buildForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddBookPage');
  }

  private buildForm() {

    if (this.book) {
      this.displayImage = true;
      this.pageTitle = "Update Book";
      this.coverText = 'Change Cover Photo'
      this.buttonText ="Update";
      this.bookForm = this.formBuilder.group({
        title: this.book.title,
        description: this.book.description,
        author: this.book.author,
        publisher: this.book.publisher,
        price: this.book.price,
        quantity: this.book.quantity,
        category: this.book.category,
        cover: this.book.cover
      });
    } else { 
      this.displayImage = false;
      this.pageTitle ="Add Book";
      this.coverText = 'Add Cover Photo'
      this.buttonText ="Add";
      this.bookForm = this.formBuilder.group({
        title: [''],
        description: [''],
        author: [''],
        publisher: [''],
        price: [''],
        quantity: [''],
        category: [''],
        cover: ['']
      });
    }
    
  }

  addToLibrary() {

      if (this.book) { // existing book

        this.book.title = this.bookForm.value.title;
        this.book.description = this.bookForm.value.description;
        this.book.author = this.bookForm.value.author;
        this.book.publisher = this.bookForm.value.publisher;
        this.book.price = this.bookForm.value.price;
        this.book.quantity = this.bookForm.value.quantity;
        this.book.category = this.bookForm.value.category;
        this.book.cover = this.bookForm.value.cover;
        
        this.booksObsevable = this.bookService.updateBook(this.book);
        this.showLoader();
        this.booksObsevable.subscribe(
          result => {
            let book: any = result;
            if (this.imageSelected_Data_URL) { // we are using  XMLHttpRequest for cover image
              this.bookService.uploadCoverImageWithXMLHttpRequest(book.book_id,this.blob).then(res => {
                this.loading.dismiss();
                this.navigateBack('Book updated');
              }, err => {
                this.loading.dismiss();
                this.errorMessage = err;
              });
            } else if (this.imageSelected_File_URI) {
              this.bookService.uploadCoverImageWithFileTransfer(book.book_id,this.imageURI).then(res => {
                this.loading.dismiss();
                this.navigateBack('Book updated');
              }, err => {
                this.loading.dismiss();
                this.errorMessage = err;
              });
            } else {
              this.loading.dismiss();
              this.navigateBack('Book updated');
            }
          }, 
          error => this.errorMessage = error
        );

      } else { // new book
          this.showLoader();
          this.booksObsevable = this.bookService.createBook(this.bookForm.value);
          this.booksObsevable.subscribe(
            result => {
              let book: any = result;
              if (this.imageSelected_File_URI) { // we are using FileTransfer for cover image
                this.bookService.uploadCoverImageWithFileTransfer(book.book_id,this.imageURI).then(res => {
                  this.loading.dismiss();
                  this.navigateBack('Book added');
                }, err => {
                  this.loading.dismiss();
                  this.errorMessage = err;
                });
              } else if (this.imageSelected_Data_URL) {
                this.bookService.uploadCoverImageWithXMLHttpRequest(book.book_id,this.blob).then(res => {
                  this.loading.dismiss();
                  this.navigateBack('Book added');
                }, err => {
                  this.loading.dismiss();
                  this.errorMessage = err;
                });
              } else {
                this.loading.dismiss();
                this.navigateBack('Book added');
              }
            }, 
            error => this.errorMessage = error
          );
      }

  }

  navigateBack(message) {
    this.presentToast(message);
    this.events.publish('database:refresh', 'Refresh Database');
    this.navCtrl.pop();
  }

  presentToast(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 2500,
      cssClass: 'centerit'
    });
    toast.present();
  }

  presentActionSheet(mode) {
    let actionSheet = this.actionSheetController.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY,mode);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA,mode);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType,uploadMode) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      //destinationType: this.camera.DestinationType.DATA_URL, // we are using FILE_URI because you can create a blob from this
      //                                                          for XMLHttpRequest to use, whereas you cannot create a file name
      //                                                          from DATA_URL that the file transfer plugin needs.
      //                                                          In short, use FILE_URI if the file is uploaded using file transfer.
      //                                                          Use DATA_URL for file upload by XMLHttpRequest.
      //                                                          Use FILE_URI if you want to do both as conversion is possible this way.
      //                                                          Thanks to the creator of the 'Base64' addon that allows the conversion!
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.JPEG 
    };
 
    // Get the data of an image
    this.camera.getPicture(options).then((imageURI) => {

        if (uploadMode == 'XMLHttpRequest') {
          // convert .FILE_URI to .DATA_URL and remove the prefix.
          this.base64.encodeFile(imageURI).then((base64File: string) => {
          this.imageDataWithoutPrefix = base64File.split(',')[1];
          this.blob = this.b64toBlob(this.imageDataWithoutPrefix, 'image/jpeg', 512); // blob needs to be passed to XMLHttpRequest to upload file cover
          this.imageData = base64File; // for displaying in the html using Domsanitizer for security 
          this.imageSelected_Data_URL = true; // for *ngIf in html
          this.imageSelected_File_URI = false;
          this.displayImage = false; // for *ngIf in html

        }, (err) => {
          console.log(err);
        });
        } else { // FileTransfer
          this.imageURI = imageURI; // used to display image in html
          this.imageSelected_File_URI = true; // for *ngIf in html
          this.imageSelected_Data_URL = false;
          this.displayImage = false; // for *ngIf in html
        }
    }, (err) => {
      console.log('Error: ', err);
    });
  }

  /**
   * Convert a base64 string into a Blob according to the data and contentType.
   * 
   * @param b64Data {String} Pure base64 string without contentType
   * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
   * @param sliceSize {Int} SliceSize to process the byteCharacters
   * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
   * @return Blob
   */

  b64toBlob(b64Data, contentType, sliceSize) {

    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  showLoader(){
 
    this.loading = this.loadingController.create({
      content: 'Please wait...'
    });
 
    this.loading.present();
 
  }

}
