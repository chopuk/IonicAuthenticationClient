import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { PassportProvider } from '../auth/passport';
import { Auth0Provider } from '../auth/auth0';
import { FirebaseProvider } from '../auth/firebase';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
  
import { GlobalsModule } from '../../globals/globals.module';

@Injectable()
export class LibraryProvider {

  url: string;
  api : string;
  token: any;
 
  constructor(public http: Http, 
    public passportProvider: PassportProvider, 
    public auth0Provider: Auth0Provider, 
    public firebaseProvider: FirebaseProvider, 
    public globals: GlobalsModule, 
    public transfer: FileTransfer) {
    this.url = this.globals.value.url;
  }
 
  getBooks(): Observable<any[]> { 
    this.getAuthType();
    let headers = new Headers();
    headers.append('Authorization', this.token);
    return this.http.get(this.url + this.api + '/books', {headers: headers})
      .map(res => res.json())
      .catch(this.handleErrorObservable);
  }

  createBook(book): Observable<any> { 
    this.getAuthType();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.token);
    return this.http.post(this.url + this.api + '/books', JSON.stringify(book), {headers: headers})
      .map(res => res.json())
      .catch(this.handleErrorObservable);
  }

  updateBook(book): Observable<any> { 
    this.getAuthType();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.token);
    return this.http.put(this.url + this.api + '/books/' + book._id, JSON.stringify(book), {headers: headers})
      .map(res => res.json())
      .catch(this.handleErrorObservable);
  }
 
  deleteBook(id): Observable<any[]> { 
    this.getAuthType();
    let headers = new Headers();
    headers.append('Authorization', this.token);
    return this.http.delete(this.url + this.api + '/books/' + id, {headers: headers})
      .map(res => res.json())
      .catch(this.handleErrorObservable);
  }

  uploadCoverImageWithFileTransfer(book_id,coverImage) { 

    this.getAuthType();

    // coverImage is the object returned from the camera plugin ( photo or gallery ) in base64 form.
    // This uses the FileTransfer plugin which is being deprecated. This is replaced by XMLHttpRequest below.
   
    var options: FileUploadOptions = {
      fileKey: 'coverImage',
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      headers: {'Authorization': this.token}
    };
 
    const fileTransfer: FileTransferObject = this.transfer.create();
 
    return fileTransfer.upload(coverImage, this.url + this.api + '/books/uploadimage/'  + book_id, options);
  }

  uploadCoverImageWithXMLHttpRequest(book_id,blob) { 
    this.getAuthType();

    // This uses XMLHttpRequest as a replacement for the deprecated FileTransfer plugin above

    return new Promise(resolve => {

      let formData: any = new FormData();
      formData.append('coverImage', blob, 'cover.jpg'); // cover.jpg gets converted on the server to a unique name using 'multer' and 'moment'

        let xhr = new XMLHttpRequest();
        xhr.open('POST', this.url + this.api + '/books/uploadimage/'  + book_id, true);
        xhr.setRequestHeader('Authorization', this.token);
      
        xhr.onload = function(e) {
          resolve('Upload completed!');
        } 
        xhr.send(formData);

    });

  }

  getCategories(): Observable<any[]> { 
    this.getAuthType();
    let headers = new Headers();
    headers.append('Authorization', this.token);
    return this.http.get(this.url + this.api + '/categories', {headers: headers})
      .map(res => res.json())
      .catch(this.handleErrorObservable);
  }

  updateProfile(userid, idToken, data) { // a test using auth0
    this.getAuthType();
    
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + idToken);

    this.http.patch('https://oathkeeper.eu.auth0.com/api/v2/users/' + userid, JSON.stringify(data), {headers: headers})
      .subscribe(res => {
        //console.log(res.json());
        console.log('Updated User Profile');
    });

    this.http.get('https://oathkeeper.eu.auth0.com/api/v2/users/' + userid, {headers: headers})
      .subscribe(res => {
        console.log('GET USER V2 RESULT' +JSON.stringify(res.json()));
    });

  }

  getAuthType() {
    switch(this.globals.value.authType) {
      case 'passport':
        this.api = 'passport/api';
        this.token = this.passportProvider.token;
        break;
      case 'auth0':
        this.api = 'auth0/api';
        this.token = "Bearer " + this.auth0Provider.accessToken;
        break;
      case 'firebase':
        this.api = 'firebase/api';
        this.token = "Bearer " + this.firebaseProvider.idToken;
        break;
    }
  }

  private handleErrorObservable (error: Response | any) {
    console.log('ERROR:' + error.statusText);
	  console.error(error.message || error);
	  return Observable.throw(error.message || error.statusText || error);
  }
 
}
