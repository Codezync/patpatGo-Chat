import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/services/shared.service';
import { MediaViewComponent } from '../media-view/media-view.component';
import { ChatService } from '../../services/chat.service';
import { ChatSharedService } from '../../services/chat-shared.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input() displayMessage: any;

  customerId: string;
  senderId: string;
  date: any;
  status: string;
  text: string;
  messageType: string;
  displayName: string;
  time: any;
  finalDate: any;
  closedAgent: string;
  url: any = 'url';
  docId: any;
  msgArrPosition: any;
  isDeleted: boolean = false;

  constructor(
    private sharedService: SharedService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private chatSharedService: ChatSharedService
  ) { }


  ngOnInit(): void {
    this.mapMessageDetails();
  }


  mapMessageDetails(){
    if(this.displayMessage.sender.senderId != ''){
      this.setDate(this.displayMessage.timestamp);

      this.customerId = this.sharedService.getCustomerId();
      this.senderId = this.displayMessage.sender.senderId,
      this.date = this.displayMessage.timestamp,
      this.status = this.displayMessage.status,
      this.text = this.displayMessage.message,
      this.messageType = this.displayMessage.contentType,
      this.displayName = this.displayMessage.sender.name,
      this.docId = this.displayMessage.docId,
      this.msgArrPosition = this.displayMessage.msgArrPosition
    }else{
      this.setDate(this.displayMessage.date);
      this.closedAgent = this.displayMessage.closedAgent != null ? this.displayMessage.closedAgent: "";
    }
  }


  setDate(date: any){
    let currentDate = this.datePipe.transform(new Date(),'yyyy-MM-dd');
    let msgDate = date.substr(0,10);
    this.time = date.substr(11);

    if(currentDate == msgDate){
      this.finalDate = 'Today';
    }
    else{
      this.finalDate = msgDate;
    }
  }


  openMedia(url: string, mediaType: string){
    const modalRef = this.modalService.open(MediaViewComponent)
    this.url = url;
    modalRef.componentInstance.url = this.url;
    modalRef.componentInstance.mediaType = mediaType;
  }


  setUrl(url: string){
    this.url = url;
    console.log(this.url);
  }


  deleteMessage(docId: string, msgArrPosition: number){
    this.chatSharedService.deleteMessage(docId, msgArrPosition);
  }
}
