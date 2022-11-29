export interface message{
  contentType: string,
  message: string,
  sender:{
    imageUrl: string;
    name: string;
    senderId: string;
  },
  status: string;
  timestamp:any;
}


export interface chatDetails{
  adminTyping: boolean,
  adminOnline: boolean,
  customer:{
    imageUrl: string,
    name: string,
    senderId: string
  },
  customerTyping: boolean,
  customerOnline: boolean,
  lastMessage:{
    contentType: string,
    message: string,
    sender:{
      imageUrl: string,
      name: string,
      senderId: string
    },
    status: string,
    timestamp: any,
  },
}
