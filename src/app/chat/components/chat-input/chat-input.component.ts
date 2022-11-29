import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { message } from '../../models/chat';
import { Observable, Subscription } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { globalConstants } from 'src/app/common/globalConstants';
import { AuthService } from 'src/app/authentication/_services/auth.service';
import { ChatSharedService } from '../../services/chat-shared.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements OnInit {
  firestoreCollection = globalConstants.firestoreCollection;
  commonReplyTip: string = "Common Reply"
  attachmentTip: string = "Attachment"
  message: string;
  msgSent : any;
  newMessage !: message;
  chatDetails: any;
  userDetails: any;
  agentId: string;
  agentDetails: any[] = [];
  showUpload: boolean = false;

  messageId: Observable<any>;
  docId: string;
  responseData: any;
  inboxType: string = 'open';
  setInboxSubscription: Subscription;

  selectedFile: File = null;
  downloadURL: Observable<string>;
  fb: any;
  fileTypeArr: any;
  fileType: string;

  constructor(
    private sharedService: SharedService,
    private storage: AngularFireStorage,
    private authService: AuthService,
    private chatSharedService: ChatSharedService
  ) {
      this.setInboxSubscription=this.sharedService.getCurrentInboxType().subscribe(
        title =>{
          this.inboxType = title;
        })
    }


  ngOnInit() {
  }


  setInboxType(){
    this.inboxType = 'close'
  }


  send(){
    this.agentId = this.sharedService.getAgentId();
    if(this.message != ''){
      this.msgSent = this.message;
      this.message ='';
      this.getUserDetails('text');
    }
  }


  sendAutomaticReply(reply: string){
    this.agentId = this.sharedService.getAgentId();
    this.msgSent = reply;
    this.message = '';
    this.getUserDetails('text');
  }


  getUserDetails(type: string){
    this.userDetails = this.sharedService.getCustomerDetails();
    this.setMessageDetails(type);
    this.setChatDetails(type);
    this.sendToDb();
  }


  setMessageDetails(type: string): message{
    return this.newMessage = {
      contentType: type,
      message: this.msgSent,
      sender:{
        imageUrl: 'https://i.ibb.co/2F6fF2R/tm.png',
        name: this.authService.getUsername(),
        senderId: this.agentId
      },
      status: 'delivered',
      timestamp: new Date().toISOString().slice(0,19)
    }
  }


  setChatDetails(type: string){
    return this.chatDetails = {
      adminTyping: false,
      adminOnline: true,
      agentId: this.authService.getUsername(),
      chatStatus: 'open',
      customer: this.userDetails.customer,
      customerOnline: this.userDetails.customerOnline,
      customerTyping: this.userDetails.customerTyping,
      lastMessage:{
        contentType: type,
        message: this.msgSent,
        sender:{
          imageUrl: '',
          name: this.authService.getUsername(),
          senderId: this.agentId
        },
        status: 'seen',
        timestamp: new Date().toISOString().slice(0,19)
      },
    }
  }


  sendToDb(){
    let docId = this.sharedService.getCustomerId();

    this.chatSharedService.sendMessage(docId, this.newMessage, this.agentId)
    this.chatSharedService.updateDetails(docId, this.chatDetails);
    this.message = '';
    this.showUpload = false;
  }


  changeTyping(){
    this.sharedService.setScrollToBottom();
    let docId = this.sharedService.getCustomerId();
    this.chatSharedService.changeTypingStatus(docId)
  }


  onFileSelected(event: any){
    this.showUpload = true;
    this.agentId = this.sharedService.getAgentId();
    var n = Date.now();
    const file = event.target.files[0];
    this.fileTypeArr = file.type.split('/');
    this.fileType = this.fileTypeArr[0];
    console.log(this.fileType)
    const filePath = `uploads/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`uploads/${n}`, file);

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            this.msgSent = this.fb;

            this.getUserDetails(this.fileType);
            event.target.value = ''
          });
        })
      )
      .subscribe(url => {
        if (url) {
          //console.log(url);
        }
      });
  }

}
