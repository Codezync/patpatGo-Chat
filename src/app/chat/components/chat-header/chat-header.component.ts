import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { CustomerDetails } from '../../models/customer';
import { Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { globalConstants } from 'src/app/common/globalConstants';
import { ChatSharedService } from '../../services/chat-shared.service';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss']
})
export class ChatHeaderComponent implements OnInit {
  firestoreCollection = globalConstants.firestoreCollection;
  customerDetails: CustomerDetails;
  setUserDetailSubscription:Subscription;
  customer: CustomerDetails;
  toggle: boolean = false;
  inboxType: string;
  details: any;
  docId: string;

  display = "none";

  customerDocId: string;
  minutesToClose = 15;
  closeChatArr: any[] = [];
  timerSubscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private chatSharedService: ChatSharedService,
    ){
      this.setUserDetailSubscription=this.sharedService.getHeaderDetails().subscribe(()=>{
        this.getCustomerDetails();
    })
  }


  ngOnInit(): void {
  }


  /**
   * get customer details
   */
  getCustomerDetails(){
    this.customerDocId = this.sharedService.getCustomerId();
    this.inboxType = this.sharedService.getInboxType();

    if(this.customerDocId != ''){
      let customerDetailObservable =  this.chatSharedService.getCustomerDetails(this.customerDocId);

      customerDetailObservable
        .pipe()
        .subscribe((details) => {
          this.details = details;

          if(this.details.data.customer.emailOrPhoneNo == this.customerDocId){
            this.customerDetails = this.details.data;
          }
        })
    }
  }


  //close chat
  closeChat(){
    this.display = "none";
    this.sharedService.setInboxType('open');
    this.docId = this.sharedService.getCustomerId();
    this.removeChatId(this.docId)
    this.chatSharedService.closeChat(this.docId)
  }


  //close chat after 15 min
  // scheduleCloseChat(){
  //   this.startTimer();
  //   let currentDate = new Date();
  //   let futureDate = new Date(currentDate.getTime() + this.minutesToClose*60000);
  //   let chatCloseObject = {
  //     'id': this.sharedService.getCustomerId(),
  //     'date': futureDate,
  //     'customerId': this.sharedService.getCustomerId()
  //   }

  //   this.closeChatArr.push(chatCloseObject);
  // }


  // startTimer(){
  //   this.timerSubscription = timer(0, 1000).pipe(
  //     map(() => {
  //       console.log(this.closeChatArr);
  //       this.checkChatsToClose();
  //     })
  //   ).subscribe();
  // }


  // checkChatsToClose(){
  //   for(let i=0; i<this.closeChatArr.length; i++){
  //     if(new Date().toString() == this.closeChatArr[i].date){
  //       this.closeChat('scheduled', this.closeChatArr[i].customerId );
  //       this.closeChatArr.splice(i,1);

  //       if(this.closeChatArr.length == 0){
  //         this.timerSubscription.unsubscribe();
  //       }
  //     }
  //   }
  // }


  removeChatId(id: string){
    for(let i=0; i< this.closeChatArr.length; i++){
      if(id == this.closeChatArr[i].id){
        this.closeChatArr.splice(i,1);

        if(this.closeChatArr.length == 0){
          this.timerSubscription.unsubscribe();
        }
      }
    }
  }


  showAlert(){
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to close this chat?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.closeChat();
        Swal.fire(
          'Closed!',
          'Chat has been closed.',
          'success'
        )
      }
    })
  }


  ngOnDestroy(): void {
    // this.timerSubscription.unsubscribe();
  }
}
