import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { ChatSharedService } from '../../services/chat-shared.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit {
  @ViewChild('scrollChat') private scrollContainer: ElementRef;

  chatCollectionRef: AngularFirestoreCollection;
  chats: any[] = [];
  setUserChatSubscription:Subscription;
  setScrollSubscription:Subscription;
  messageArr: any;
  customerDocId: string;
  isScroll: boolean =true;

  constructor(
    private chatSharedService: ChatSharedService,
    private sharedService: SharedService
  ) {
      this.setUserChatSubscription = this.sharedService.getCustomerChat()
        .subscribe(()=>{
          this.getMessages();
      })

      this.setScrollSubscription = this.sharedService.getScrollToBottom()
        .subscribe(()=>{
          //console.log('click scroll')
          this.isScroll = true;
          this.scrollToBottom();

      })
     }


  ngOnInit(): void {
    this.scrollToBottom();
  }


  /**
   * get the messages of the relavant customer
   */
  getMessages(){
    this.customerDocId = this.sharedService.getCustomerId();

    if(this.customerDocId != ''){
      let messagesObservable = this.chatSharedService.getChatMessages(this.customerDocId);

      messagesObservable
        .pipe()
        .subscribe((messages => {
          this.messageArr = messages;

          if(this.messageArr[0].senderId == this.customerDocId){
            this.displayMessages();
          }
        }))

    }else{
      this.chats=[];
    }
  }


  displayMessages(){
    this.chats = [];

    for(let i=0; i<this.messageArr.length; i++){
      for(let j=0; j<this.messageArr[i].message.length; j++){
        if(j == 0){
          let chatArr = {date:this.messageArr[i].message[0].timestamp,sender:{senderId:''}, type: 'start'};
          this.chats.push(chatArr);
          this.chats.push(this.messageArr[i].message[j])
        }else{
          let msgDetails = {
            docId: this.messageArr[i].id,
            msgArrPosition: j,
            contentType: this.messageArr[i].message[j].contentType,
            message: this.messageArr[i].message[j].message,
            sender: {
              imageUrl: this.messageArr[i].message[j].sender.imageUrl,
              name: this.messageArr[i].message[j].sender.name,
              senderId: this.messageArr[i].message[j].sender.senderId
            },
            status: this.messageArr[i].message[j].status,
            timestamp: this.messageArr[i].message[j].timestamp
          }
          this.chats.push(msgDetails)
        }
      }
      if(i != this.messageArr.length-1){
        let chatArr ={date:this.messageArr[i].timestamp,sender:{senderId:''}, type: 'close', closedAgent: this.messageArr[i].closedAgent};
        this.chats.push(chatArr);
      }
    }
  }


  ngAfterViewChecked() {
   //console.log(this.isScroll)
   if(this.isScroll){
     this.scrollToBottom();
   }
  }

  scrollTrigger(){
    this.isScroll = false;
    //console.log('scroll trigger..............')
  }




  scrollToBottom(): void {
    //console.log('scroll to bottom')
    try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
