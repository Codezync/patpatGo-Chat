import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { SharedService } from 'src/app/services/shared.service';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/authentication/_services/auth.service';
import { ChatSharedService } from '../../services/chat-shared.service';

@Component({
  selector: 'app-close-chat-list',
  templateUrl: './close-chat-list.component.html',
  styleUrls: ['./close-chat-list.component.scss']
})
export class CloseChatListComponent implements OnInit {
  chatListCollectionRef: AngularFirestoreCollection<any>;
  searchText: any;
  userDetails: any;
  chats: any[] = [];
  setChatListSubscription:Subscription;
  pageLoad: boolean = true;
  givenName: string;
  inboxType: string;

  customerId: string;
  agentId: string;
  favIcon: HTMLLinkElement = document.querySelector('#appIcon');

  msgStatus: string;
  msgSenderId: string;
  msgTimestamp: string;
  customerArray: any;

  docIdArr: any[] = [];
  openChats: any;

  public p: any;

  //Save first document in snapshot of items received
  public firstInResponse: any = [];

  //Save last document in snapshot of items received
  public lastInResponse: any = [];

  //Keep the array of first document of previous pages
  public prev_strt_at: any = [];

  //Maintain the count of clicks on Next Prev button
  public pagination_clicked_count = 0;

  //Maintain the count of clicks on Next Prev button
  public pageSize = 20;

//Maintain the count of clicks on Next Prev button
  public itemnumberbypage = 0;

  //Disable next and prev buttons
  public disable_next: boolean = false;
  public disable_prev: boolean = false;
  private searchlinkqueriesData: AngularFirestoreDocument<any>;

  //Data object for listing items
  searchlinkqueriesdata: any[] = [];

  searchlinkqueriesdatanext: Observable<any[]>;

  searchlinkqueriesdataprev: Observable<any[]>;

  constructor(
    private chatSharedService: ChatSharedService,
    private sharedService: SharedService,
    private authService: AuthService
  ) {
    this.setChatListSubscription = this.sharedService.getChatList()
    .subscribe(()=>{
      this.pageLoad = true;
      this.getCloseChatList();
    })
   }


   ngOnInit(): void {
    this.getCloseChatList();
  }


  getCloseChatList(){
    let chatListObservable = this.chatSharedService.getChatList("close");

    chatListObservable
      .pipe()
      .subscribe((chats) => {
        this.setChatDetails(chats);
      }, err => {
        console.log(err)
      })
  }



  setChatDetails(chatList: any){
    this.chats = chatList;

    if(this.pageLoad && chatList.length != 0){
      this.setPageLoadingDetails();
    }else if(chatList.length == 0){
      this.chats = [];
      this.sharedService.setCustomerId('');
      this.sharedService.setCustomerChat();
      this.sharedService.setHeaderDetails();
    }
    this.givenName = this.authService.getUsername();
    this.customerId = this.sharedService.getCustomerId();
    this.pageLoad = false;
  }


  changeCustomerDetails(chat: any){
    if(chat.customer.emailOrPhoneNo != this.sharedService.getCustomerId()){
      this.sharedService.setCustomerId(chat.customer.emailOrPhoneNo);
      this.sharedService.setCustomerDetails(chat);
      this.sharedService.setHeaderDetails();
      this.sharedService.setCustomerChat();
    }
  }


  setPageLoadingDetails(){
    this.sharedService.setCustomerId(this.chats[0].customer.emailOrPhoneNo);
    this.sharedService.setCustomerDetails(this.chats[0]);
    this.agentId = this.sharedService.getAgentId();
    this.sharedService.setCustomerChat();
    this.sharedService.setHeaderDetails();
  }

}
