import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { first } from 'rxjs/operators';
import { ChatSharedService } from 'src/app/chat/services/chat-shared.service';

import Swal from 'sweetalert2';
import { AuthResponse, loginUser } from '../_models/signin.model';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    private chatSharedService: ChatSharedService
   ) { }


  loginUser!: loginUser;
  loginUserForm!: FormGroup;
  userSubmitted!: boolean;

  client_id: string ='patpatApi';
  client_secret: string = '8G5TvcMWW7kyCYUWXvaf4Q8NpPCChDut8Z7n';
  grant_type: string = 'password';
  response!: AuthResponse;

  responseData: any;
  docId:any;


  get Username(){
    return this.loginUserForm.get('Username') as FormControl;
  }


  get Password(){
    return this.loginUserForm.get('Password') as FormControl;
  }


  ngOnInit(): void {
    this.createLoginForm();
  }


  createLoginForm(){
    this.loginUserForm = this.formBuilder.group({
      Username: ['', Validators.required],
      Password: ['', Validators.required]
    })
  }


  login(){
    if(this.loginUserForm.valid){
      this.userSubmitted = false;
      this.authService.login(this.loginUserData())
        .pipe(first())
          .subscribe({
            next: () =>{
              this.anonymousLogin();
              this.authService.userInfo();
              // this.router.navigate(['/home']);
            },
            error: error =>{
              console.log(error);
              this.router.navigate(['/home']);
            Swal.fire({
              icon: 'error',
              text: 'Check your username and password!',
            })
          }
        });
    }
  }


  loginUserData(): loginUser{
    return this.loginUser = {
      client_id: this.client_id,
      client_secret: this.client_secret,
      grant_type: this.grant_type,
      Username: this.Username.value,
      Password: this.Password.value
    }
  }


  async anonymousLogin() {
    try {
      const user = await this.afAuth.auth.signInAnonymously();
      if(user.additionalUserInfo.isNewUser == true){
        location.reload();
      }
      this.chatSharedService.closeEmptyChats();
    } catch (error) {
        return console.log(error);
    }
  }


  //Changing the chatStatus as close of the chats older than 7 days
  // checkOldChats(){
  //   let currentDate = new Date();
  //   let finalDate: any;
  //   finalDate = new Date(currentDate);
  //   finalDate.setDate(finalDate.getDate() - 7);

  //   this.db.firestore.collection(this.firestoreCollection).where('chatStatus','==','open')
  //   .get()
  //   .then((querySnapshot) =>{
  //     querySnapshot.forEach((doc) => {
  //       this.responseData = doc.data();
  //       this.docId = this.responseData.customer.emailOrPhoneNo;
  //       let msgSentDate = this.responseData.lastMessage.timestamp;

  //       msgSentDate = new Date(msgSentDate);

  //       if(msgSentDate<finalDate){
  //         let id = this.docId

  //         this.db.firestore.collection(this.firestoreCollection).doc(this.docId).collection('content').where('status','==','open')
  //           .get()
  //           .then((querySnapshot) => {
  //             querySnapshot.forEach((doc) => {
  //               // console.log(id)
  //               // console.log(doc.id)

  //               this.db.collection(this.firestoreCollection).doc(id).update({
  //                 chatStatus: 'close'
  //               })
  //               this.db.collection(this.firestoreCollection).doc(id).collection('content').doc(doc.id).update({
  //                 status: 'close',
  //                 timestamp: new Date().toISOString().slice(0,19),
  //               });
  //             })
  //           })
  //       }
  //     })
  //   })
  // }


}
