import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { Observable, Subscription } from 'rxjs';
import { globalConstants } from '../../../common/globalConstants';
import { AuthService } from 'src/app/authentication/_services/auth.service';
import { ChatSharedService } from '../../services/chat-shared.service';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  searchText: any;
  userDetails: any;
  chats: any[] = [];
  setChatListSubscription:Subscription;
  pageLoad: boolean = true;
  givenName: string;
  inboxType: string;
  globalArray = globalConstants.customerArray;

  customerId: string;
  agentId: string;
  favIcon: HTMLLinkElement = document.querySelector('#appIcon');

  msgStatus: string;
  msgSenderId: string;
  msgTimestamp: string;
  customerArray: any;
  chatForm: FormGroup;

  docIdArr: any[] = [];
  openChats: any;

  closeChatsArr: any[] = [];
  closeChatsQueue: any[] = [];

  closeChatSubscription: Subscription;
  showCheckboxSubscription: Subscription;
  showCheckbox: boolean = false;


  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private chatSharedService: ChatSharedService,
    private fb: FormBuilder
    ) {
      this.setChatListSubscription = this.sharedService.getOpenChatList()
        .subscribe(()=>{
          this.pageLoad = true;
          this.getOpenChatList();
        })

      this.closeChatSubscription = this.sharedService.getCloseChatsArrEmpty()
        .subscribe(() => {
          this.closeChatsQueue = [];
          //console.log(this.closeChatsQueue)
        })

      this.showCheckboxSubscription = this.sharedService.getShowCheckbox()
        .subscribe((showCheckbox) => {
          //console.log(showCheckbox);
          this.showCheckbox = showCheckbox
        })
    }


  ngOnInit(): void {
    this.createChatForm();
    this.getOpenChatList();
    this.listenChatStatus();

  }

  createChatForm(){
    // this.chatForm = this.fb.group({
    //   chatCheckbox: []
    //   // chats: this.fb.array([])
    // })
  }


  /**
   * get chat list with chatStatus == open
   */
  getOpenChatList(){
    let chatListObservable = this.chatSharedService.getChatList("open");

    chatListObservable
      .pipe()
      .subscribe((chats) => {

        this.setChatDetails(chats);
      }, err => {
        console.log(err)
      })
  }


  /**
   * listening to the chat statuses because chats may be closed by other agents
   */
  listenChatStatus(){
    let chatStatusListener = this.chatSharedService.listenChatStatus();

    chatStatusListener
      .pipe()
      .subscribe((chats) => {
        this.checkSelectedChatsForMultipleDelete(chats)
        this.setChatStatusListenDetails(chats)
      }, err => {
        console.log(err)
      })
  }


  checkSelectedChatsForMultipleDelete(chatList: any){
    this.closeChatsQueue = [];
    chatList.forEach((chat: any) => {

      //console.log(chat.customer.emailOrPhoneNo + ' --> ' +chat.checked + ' ' + this.closeChatsQueue.includes(chat.customer.emailOrPhoneNo));
      if((chat.checked == true) && !this.closeChatsQueue.includes(chat.customer.emailOrPhoneNo)){

        this.closeChatsQueue.push(chat.customer.emailOrPhoneNo)
      }else if((chat.checked == false) && this.closeChatsQueue.includes(chat.customer.emailOrPhoneNo)){
        const index = this.closeChatsQueue.findIndex(x => x.value === chat.customer.emailOrPhoneNo)
        this.closeChatsQueue.splice(index, 1)
      }
    })

   // console.log(this.closeChatsQueue)
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
    this.checkNewMessages();
  }


  setChatStatusListenDetails(chats: any){
    this.docIdArr = [];

    if(chats.length != 0){
      this.openChats = chats;

      for(let i=0; i<this.openChats.length; i++){
        this.docIdArr.push(this.openChats[i].id);
      }

      let chatCustomerId = this.sharedService.getCustomerId();

      for(let i=0; i<this.docIdArr.length; i++){
        if(this.docIdArr[i] == chatCustomerId){
          break;
        }else if((i == this.docIdArr.length-1) && (this.sharedService.getInboxType() != "close")){
          this.setPageLoadingDetails();
        }
      }
    }
  }


  changeCustomerDetails(chat: any){
    this.sharedService.setScrollToBottom();
    if(chat.customer.emailOrPhoneNo != this.sharedService.getCustomerId()){
      this.sharedService.setCustomerId(chat.customer.emailOrPhoneNo);
      this.sharedService.setCustomerDetails(chat);

      if(chat.lastMessage.status != 'seen'){
        for(let i=0; i<this.globalArray.length; i++){
          if(this.globalArray[i].id == chat.customer.emailOrPhoneNo){
            this.globalArray.splice(i,1);
            i--;
          }
        }
        this.chatSharedService.updateLastMessageStatus(chat.customer.emailOrPhoneNo)
      }

      if(this.globalArray.length == 0){
        this.favIcon.href = '../../../assets/images/logo.png'
      }
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


  checkNewMessages(){
    this.customerId= this.sharedService.getCustomerId();

    for(let i=0; i<this.chats.length;i++){
      this.msgStatus = this.chats[i].lastMessage.status;
      this.msgSenderId = this.chats[i].lastMessage.sender.senderId;
      this.msgTimestamp = this.chats[i].lastMessage.timestamp;
      this.customerArray = this.globalArray;
      let arrLength = this.customerArray.length;

      if((this.msgStatus == 'delivered') && (this.msgSenderId != this.customerId) && (this.msgSenderId != this.agentId)){
        if(arrLength == 0){
          let notification = {id: this.msgSenderId, date:this.msgTimestamp};
          this.customerArray.push(notification);
          this.playNotification();
        }else{
          for(let j=0; j<arrLength; j++){
            if((this.customerArray[j].id == this.msgSenderId) && (this.customerArray[j].date == this.msgTimestamp)){
              break;

            }else if((this.customerArray[j].id == this.msgSenderId) && (this.customerArray[j].date != this.msgTimestamp) && (j == this.customerArray.length-1)){
              let notification = {id: this.msgSenderId, date: this.msgTimestamp}
              this.customerArray.push(notification);
              this.playNotification();

            }else if(j == this.customerArray.length-1){
              let notification = {id: this.msgSenderId, date: this.msgTimestamp}
              this.customerArray.push(notification);
              this.playNotification();
            }
          }
        }
      }
    }
  }


  playNotification(){
    this.changeIcon();
    let audio = new Audio();
    audio.src = "../../../assets/audio/alert.ogg";
    audio.load();
    audio.play();
  }


  changeIcon() {
    this.favIcon.href = '../../../assets/images/logoMsg.png';
  }


  changeCloseEvent(event: any){
    //console.log(event.target.checked)

    this.chatSharedService.updateCheckboxStatus(event.target.value, event.target.checked)

    // const chats: FormArray = this.chatForm.get('chats') as FormArray;

    if (event.target.checked && !this.closeChatsQueue.includes(event.target.value)) {
      //chats.push(new FormControl(event.target.value));
      this.closeChatsQueue.push(event.target.value)
    } else {
       //const index = chats.controls.findIndex(x => x.value === event.target.value);
      // chats.removeAt(index);

      const index = this.closeChatsQueue.findIndex(x => x.value === event.target.value)
      this.closeChatsQueue.splice(index, 1)
    }



    //console.log(this.closeChatsQueue)
    if(this.closeChatsQueue.length == 0){
      let chatObject = {
        closeChatsArr: this.closeChatsQueue,
        disability: true
      }
      this.sharedService.setButtonDisability(chatObject)
    }else{
      let chatObject = {
        closeChatsArr: this.closeChatsQueue,
        disability: false
      }
      this.sharedService.setButtonDisability(chatObject)
    }

    this.sharedService.setCloseChatsArr(this.closeChatsQueue)
  }



}
