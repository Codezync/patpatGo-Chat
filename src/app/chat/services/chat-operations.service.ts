import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SharedService } from 'src/app/services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ChatOperationsService {
  messageList: any;
  chatList: any;
  messageArr: any;
  chatDetails: any;

  firstCollection: any = "driver";
  firstDocId: any = "driver_support_chat";
  secondCollection: any;

  constructor(
    private db: AngularFirestore,
    private sharedService: SharedService,
  ) { }


  setCollection(chatType: string){
    if(chatType == 'debug'){
      this.secondCollection = "debug"
    }else{
      this.secondCollection = "release"
    }
  }

  /**
   *get the chat list from db (chatStatus == open) || (chatStatus == close)
   */
  getChatList(status: string): Observable<any>{
    const chatListCollectionRef = this.db
      .collection(this.firstCollection)
      .doc(this.firstDocId)
      .collection(this.secondCollection, ref => ref
        .limit(10)
        .where("chatStatus","==", status)
        .orderBy("lastMessage.timestamp", "desc"));

    const chats$ = chatListCollectionRef
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c =>
            ({
              id: c.payload.doc.id,
              ...c.payload.doc.data() as {}
            })
          )
        )
      )
    return chats$;
  }


  getPrevChatList(status: any, prev_startAt: any, firstInResponse: any): Observable<any>{
    const chatListCollectionRef = this.db
      .collection(this.firstCollection)
      .doc(this.firstDocId)
      .collection(this.secondCollection, ref => ref
        .startAt(prev_startAt)
        .endBefore(firstInResponse)
        .limit(10)
        .where("chatStatus","==", status)
        .orderBy("lastMessage.timestamp", "desc"));

    const chats$ = chatListCollectionRef
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c =>
            ({
              id: c.payload.doc.id,
              ...c.payload.doc.data() as {}
            })
          )
        )
      )
    return chats$;
  }


  getNextChatList(status: any, lastInResponse: any): Observable<any>{
    const chatListCollectionRef = this.db
      .collection(this.firstCollection)
      .doc(this.firstDocId)
      .collection(this.secondCollection, ref => ref
        .limit(10)
        .where("chatStatus","==", status)
        .orderBy("lastMessage.timestamp", "desc")
        .startAfter(lastInResponse));

    const chats$ = chatListCollectionRef
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c =>
            ({
              id: c.payload.doc.id,
              ...c.payload.doc.data() as {}
            })
          )
        )
      )
    return chats$;
  }


  /**
   * listening to the chat statuses because chats may be closed by the other agents(chatStataus == open)
   */
  listenChatStatus(){
    const chatStatusListenCollectionRef = this.db
      .collection(this.firstCollection)
      .doc(this.firstDocId)
      .collection(this.secondCollection, ref => ref.where('chatStatus','==','open').where('lastMessage.message','!=',''));

    const chatStatuses$ = chatStatusListenCollectionRef
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c =>
            ({
              id: c.payload.doc.id,
              ...c.payload.doc.data() as {} })
          )
        )
      )
    return chatStatuses$;
  }


  /**
   * Get the messages from the db according to the customer ID
   */
  getChatMessages(customerDocId: string){
    const chatMessagesRef = this.db
      .collection(this.firstCollection)
      .doc(this.firstDocId)
      .collection(this.secondCollection)
      .doc(customerDocId)
      .collection('content', ref => ref.orderBy("timestamp","asc"));

    const messages$ = chatMessagesRef
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c =>
            ({
              id: c.payload.doc.id,
              ...c.payload.doc.data() as {} })
          )
        )
      )
    return messages$;
  }


  /**
   *get customer details
   */
  getCustomerDetails(customerDocId: string){
    const customerDetailsRef = this.db
      .collection(this.firstCollection)
      .doc(this.firstDocId)
      .collection(this.secondCollection)
      .doc(customerDocId);

    const customerDetails$ = customerDetailsRef
      .snapshotChanges()
      .pipe(
        map(action => {
          const data = action.payload.data();
          const id = action.payload.id;
          return { id, data };
        }))
    return customerDetails$;
  }


  /**
   *close a chat - updating the chatStatus == close
   */
  closeChat(docId: string){
    this.db.firestore.collection(this.firstCollection)
      .doc(this.firstDocId)
      .collection(this.secondCollection)
      .doc(docId)
      .collection('content')
      .where('status','==','open')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.changeStatusOfSession(this.firstCollection, this.firstDocId, this.secondCollection, docId);
            this.changeStatusOfMessage(this.firstCollection, this.firstDocId, this.secondCollection, docId, doc.id)
            // this.db
            //   .collection(this.firstCollection)
            //   .doc(this.firstDocId)
            //   .collection(this.secondCollection)
            //   .doc(docId)
            //   .update({
            //     chatStatus: 'close',
            //     agentId:''
            //   });

            // this.db
            //   .collection(this.firstCollection)
            //   .doc(this.firstDocId)
            //   .collection(this.secondCollection)
            //   .doc(docId)
            //   .collection('content')
            //   .doc(doc.id)
            //     .update({
            //       status: 'close',
            //       timestamp: new Date().toISOString().slice(0,19),
            //       'closedAgent': localStorage.getItem('agentName')
            //     });

            setTimeout(() => {
              this.sharedService.setOpenChatList();
            }, 2000);
          })
        })
  }


  changeStatusOfSession(firstCollection: string, firstDocId: string, secondCollection: string, secondDocId: string){
    this.db
      .collection(firstCollection)
      .doc(firstDocId)
      .collection(secondCollection)
      .doc(secondDocId)
      .update({
        chatStatus: 'close',
        agentId:''
      });
  }


  changeStatusOfMessage(firstCollection: string, firstDocId: string, secondCollection: string, secondDocId: string, thirdDocId: string){
    this.db
      .collection(firstCollection)
      .doc(firstDocId)
      .collection(secondCollection)
      .doc(secondDocId)
      .collection('content')
      .doc(thirdDocId)
        .update({
          status: 'close',
          timestamp: new Date().toISOString().slice(0,19),
          'closedAgent': localStorage.getItem('agentName')
        });
  }



  /**
   *Updating the lastMessage status as seen
   */
  updateLastMessageStatus(docId: string){
    this.db
      .collection(this.firstCollection)
      .doc(this.firstDocId)
      .collection(this.secondCollection)
      .doc(docId)
        .update({
          "lastMessage.status": 'seen'
        });
  }


  /**
   * Send a message to db
   */
  sendMessage(docId: string, message: any, agentId: string){
    this.db.firestore
      .collection(this.firstCollection)
      .doc(this.firstDocId)
      .collection(this.secondCollection)
      .doc(docId)
      .collection('content').where('status','==','open')
        .get()
        .then((querySnapshot) =>{
          querySnapshot.forEach((doc) => {
            this.messageArr = doc.data();

            for(let i=1; i<this.messageArr.message.length; i++){
              if(this.messageArr.message[i].sender.senderId != agentId){
                this.messageArr.message[i].status = 'seen'
              }
            }
            this.messageArr.message.push(message);

            this.db
              .collection(this.firstCollection)
              .doc(this.firstDocId)
              .collection(this.secondCollection)
              .doc(docId)
              .collection('content')
              .doc(doc.id)
                .update({
                  message: this.messageArr.message,
                  timestamp: new Date().toISOString().slice(0,19)
                });
          })
        })
  }


  /**
   *update details in DB
   */
  updateDetails(docId: string, customerDetails: any){
    this.db
      .collection(this.firstCollection)
      .doc(this.firstDocId)
      .collection(this.secondCollection)
      .doc(docId)
        .update(customerDetails);
  }


  /**
   * Changing the typing status
   */
  changeTypingStatus(docId: string){
    this.db
      .collection(this.firstCollection)
      .doc(this.firstDocId)
      .collection(this.secondCollection)
      .doc(docId)
        .update({
          adminTyping: true
        })

    setTimeout(() => {
      this.db
      .collection(this.firstCollection)
      .doc(this.firstDocId)
      .collection(this.secondCollection)
      .doc(docId)
        .update({
          adminTyping: false
        })
    }, 3000);
  }


  /**
   *To hide the deleted messages changing the status of messages as hidden
   */
  deleteMessage(docId: string, msgArrPosition: number){
    let id = this.sharedService.getCustomerId();

    this.db.firestore
      .collection(this.firstCollection)
      .doc(this.firstDocId)
      .collection(this.secondCollection)
      .doc(id).collection('content').doc(docId)
        .get()
        .then((querySnapshot) =>{
            this.messageList = querySnapshot.data();
            this.messageList.message[msgArrPosition].status = 'hidden';

            this.db
              .collection(this.firstCollection)
              .doc(this.firstDocId)
              .collection(this.secondCollection)
              .doc(id)
              .collection('content')
              .doc(docId)
                .update({
                  message: this.messageList.message,
                  isDeleted: true
                })
          })
  }


  /**
   * Close the chats - To fix the issues comeup with iOS chat app
   */
  closeEmptyChats(){
    let count = 0;
    this.db.firestore
      .collection(this.firstCollection)
      .doc(this.firstDocId)
      .collection(this.secondCollection).where('chatStatus','==','open')
        .get()
        .then((querySnapshot) =>{
          querySnapshot.forEach((doc) => {
            this.chatDetails = doc.data();
            let docId = this.chatDetails.customer.emailOrPhoneNo;

            //close chats with lastMessage == null and chatStatus == open (iOS - after version 12.0.13)
            if(this.chatDetails.lastMessage == null){
              this.closeChat(docId)
            }else{
              //close chats with lastMessage.message == "" (iOS)
              let message = this.chatDetails.lastMessage.message;

              if(message == ""){
                count++;
                console.log(docId)
                this.closeChat(docId)
              }
            }
          })
          console.log(count)
        })
  }


  /**
   * Close multiple chats
   */
   closeMultipleChats(chatsIdArr: any[]){
    console.log(chatsIdArr)

    chatsIdArr.forEach((id) =>{
      // console.log(id)
      this.closeChat(id)
    })
  }



  updateCheckboxStatus(docId: string, status: string){
    this.db
    .collection(this.firstCollection)
    .doc(this.firstDocId)
    .collection(this.secondCollection)
    .doc(docId)
        .update({
          "checked": status
        });
  }


}
