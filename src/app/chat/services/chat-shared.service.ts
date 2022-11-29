import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/common/global.service';
import { ChatOperationsService } from './chat-operations.service';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root'
})


export class ChatSharedService {
  role: string;
  roleValue = "Operations";
  agentId: string;
  testId = "operations@tmdone.com";


  constructor(
    private chatService: ChatService,
    private chatOperationsService: ChatOperationsService,
    private globalService: GlobalService
  ) { }


  getAgentRole(){
    this.role = this.globalService.getAgentRole();
    this.agentId = localStorage.getItem('agentId')

    if((this.role == this.roleValue) && (this.agentId == this.testId)){
      this.chatOperationsService.setCollection('debug')
    }else if((this.role == this.roleValue) && (this.agentId != this.testId)){
      this.chatOperationsService.setCollection('release')
    }
  }


  getChatList(status: string):Observable<any>{
    this.getAgentRole();

    let chats$;

    if(this.role == this.roleValue){
      chats$ = this.chatOperationsService.getChatList(status)
    }else{
      chats$ = this.chatService.getChatList(status)
    }

    return chats$;
  }


  listenChatStatus(){
    let chatStatuses$;

    if(this.role == this.roleValue){
      chatStatuses$ = this.chatOperationsService.listenChatStatus();
    }else{
      chatStatuses$ = this.chatService.listenChatStatus();
    }

    return chatStatuses$;
  }


  getChatMessages(customerDocId: string){
    let chatMessages$;

    if(this.role == this.roleValue){
      chatMessages$ = this.chatOperationsService.getChatMessages(customerDocId);
    }else{
      chatMessages$ = this.chatService.getChatMessages(customerDocId);
    }

    return chatMessages$;
  }


  getCustomerDetails(customerDocId: string){
    let customerDetails$;

    if(this.role == this.roleValue){
      customerDetails$ = this.chatOperationsService.getCustomerDetails(customerDocId)
    }else{
      customerDetails$ = this.chatService.getCustomerDetails(customerDocId)
    }

    return customerDetails$;
  }


  closeChat(customerDocId: string){
    if(this.role == this.roleValue){
      this.chatOperationsService.closeChat(customerDocId)
    }else{
      this.chatService.closeChat(customerDocId)
    }
  }


  updateLastMessageStatus(docId: string){
    if(this.role == this.roleValue){
      this.chatOperationsService.updateLastMessageStatus(docId)
    }else{
      this.chatService.updateLastMessageStatus(docId)
    }
  }


  sendMessage(docId: string, message: any, agentId: string){
    if(this.role == this.roleValue){
      this.chatOperationsService.sendMessage(docId, message, agentId)
    }else{
      this.chatService.sendMessage(docId, message, agentId)
    }
  }


  updateDetails(docId: string, customerDetails: any){
    if(this.role == this.roleValue){
      this.chatOperationsService.updateDetails(docId, customerDetails)
    }else{
      this.chatService.updateDetails(docId, customerDetails)
    }
  }


  changeTypingStatus(docId: string){
    if(this.role == this.roleValue){
      this.chatOperationsService.changeTypingStatus(docId)
    }else{
      this.chatService.changeTypingStatus(docId)
    }
  }


  deleteMessage(docId: string, msgArrPosition: number){
    if(this.role == this.roleValue){
      this.chatOperationsService.deleteMessage(docId, msgArrPosition)
    }else{
      this.chatService.deleteMessage(docId, msgArrPosition)
    }
  }


  closeEmptyChats(){
    if(this.role == this.roleValue){
      this.chatOperationsService.closeEmptyChats()
    }else{
      this.chatService.closeEmptyChats()
    }
  }


  closeMultipleChats(chatIdArr: any[]){
    if(this.role == this.roleValue){
      this.chatOperationsService.closeMultipleChats(chatIdArr)
    }else{
      this.chatService.closeMultipleChats(chatIdArr)
    }
  }


  updateCheckboxStatus(chatId: string, status: string){
    if(this.role == this.roleValue){
      this.chatOperationsService.updateCheckboxStatus(chatId, status)
    }else{
      this.chatService.updateCheckboxStatus(chatId, status)
    }
  }

}
