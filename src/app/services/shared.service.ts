import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private subjectDetails = new Subject<any>();
  private subjectChat = new Subject<any>();
  private subjectChatList = new Subject<any>();
  private subjectOpenChatList = new Subject<any>();
  private subjectScroll= new Subject<any>();
  private subjectInBoxType = new BehaviorSubject('open');
  private subjectButtonDisable = new BehaviorSubject(true);
  private subjectEmptyChatArr = new Subject<any>();
  private subjectShowCheckbox = new BehaviorSubject(false);

  customerId: string;
  customerDetails: any;
  agentDetails: any;
  agentId: string;
  inboxType: string = 'open';
  closeChatsArr: any[] = [];

  constructor(
    private db : AngularFirestore
  ){
    this.setAgentId();
  }

  //header details
  setHeaderDetails(){
    this.subjectDetails.next();
  }

  getHeaderDetails(): Observable<any>{
    return this.subjectDetails.asObservable();
  }


  //customer chat
  setCustomerChat(){
    this.subjectChat.next();
  }

  getCustomerChat():Observable<any>{
    return this.subjectChat.asObservable();
  }


  //chat list
  setChatList(){
    this.subjectChatList.next();
  }

  getChatList():Observable<any>{
    return this.subjectChatList.asObservable();
  }


  //customer details
  setCustomerDetails(customerDetails: any){
    this.customerDetails = customerDetails;
  }

  getCustomerDetails(){
    return this.customerDetails;
  }


  //customer ID
  setCustomerId(currentId: string){
    this.customerId = currentId;
  }

  getCustomerId(){
    return this.customerId;
  }


  //agent ID
  setAgentId(){
    this.db.firestore.collection('admin')
    .get()
    .then((querySnapshot) =>{
      querySnapshot.forEach((doc) =>{
        this.agentId = doc.id
      })
     })
  }

  getAgentId(){
    return this.agentId;
  }


  //inbox type
  setInboxType(inboxType: string){
    this.inboxType = inboxType;
  }

  getInboxType(){
    return this.inboxType;
  }


  //current inbox type
  setCurrentInboxType(title: string){
    this.subjectInBoxType.next(title);
  }

  getCurrentInboxType():Observable<any>{
    return this.subjectInBoxType.asObservable();
  }


  //open chat list
  setOpenChatList(){
    this.subjectOpenChatList.next();
  }

  getOpenChatList(): Observable<any>{
    return this.subjectOpenChatList.asObservable();
  }


  //scroll
  setScrollToBottom(){
    this.subjectScroll.next();
  }

  getScrollToBottom(): Observable<any>{
    return this.subjectScroll.asObservable();
  }


  //button disability
  setButtonDisability(chatsObj: any){
    this.subjectButtonDisable.next(chatsObj);
  }

  getButtonDisability():Observable<any>{
    return this.subjectButtonDisable.asObservable();
  }


  //close chat arr
  setCloseChatsArr(closeChatsArr: any[]){
    this.closeChatsArr = closeChatsArr;
  }

  getCloseChats(){
    return this.closeChatsArr;
  }


  //close chat arr empty
  setCloseChatsArrEmpty(){
    this.subjectEmptyChatArr.next();
  }

  getCloseChatsArrEmpty(): Observable<any>{
    return this.subjectEmptyChatArr.asObservable();
  }


  //show checkbox
  setShowCheckbox(showCheckbox: boolean){
    this.subjectShowCheckbox.next(showCheckbox);
  }

  getShowCheckbox():Observable<any>{
    return this.subjectShowCheckbox.asObservable();
  }


}
