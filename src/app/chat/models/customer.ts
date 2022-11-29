export interface CustomerDetails {
  adminOnline:    boolean;
  adminTyping:    boolean;
  agentId:        string;
  chatStatus:     string;
  customer:       Customer;
  customerOnline: boolean;
  customerTyping: boolean;
  lastMessage:    LastMessage;
}

export interface Customer {
  appVersion:     string;
  deviceName:     string;
  email:          string;
  emailOrPhoneNo: string;
  imageUrl:       string;
  name:           string;
  phoneNo:        string;
  platform:       string;
}

export interface LastMessage {
  contentType: string;
  message:     string;
  sender:      Sender;
  status:      string;
  timestamp:   Date;
}

export interface Sender {
  imageUrl: string;
  name:     string;
  senderId: string;
}
