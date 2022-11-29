import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from 'src/app/authentication/_services/auth.service';
import { agent } from 'src/app/chat/models/agent';
import { globalConstants } from 'src/app/common/globalConstants';


@Component({
  selector: 'app-dropdown-user',
  templateUrl: './dropdown-user.component.html',
  styleUrls: ['./dropdown-user.component.scss']
})
export class DropdownUserComponent implements OnInit {
  firestoreCollection = globalConstants.firestoreCollection;
  username !: string;
  email !: string;
  pageLoad: boolean = true;

  responseData: any;

  constructor(private authService: AuthService,
              private db: AngularFirestore) {}

  ngOnInit(){
    this.authService.userInfo();
   
  }

  displayDetails(){
    if(this.pageLoad){
      this.username = this.authService.getUsername();
      this.email = this.authService.getUsermail();
    }
    this.pageLoad = false;
  }

  logout(){
    this.updateAdminStatus();
  }

  updateAdminStatus(){
    let username = this.authService.getUsername();
    this.db.firestore.collection(this.firestoreCollection).where('chatStatus','==','open').where('agentId','==',username)
        .get()
        .then((querySnapshot) =>{
          querySnapshot.forEach((doc) => {
            this.responseData = doc.data();

            let id = this.responseData.customer.emailOrPhoneNo;

            this.db.collection(this.firestoreCollection).doc(id).update({
              adminOnline: false
            })
          })
         })

         this.authService.logout();
   }
}
