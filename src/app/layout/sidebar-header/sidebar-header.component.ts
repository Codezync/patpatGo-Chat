import { Component, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatSharedService } from 'src/app/chat/services/chat-shared.service';
import { GlobalService } from 'src/app/common/global.service';
import { SharedService } from 'src/app/services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar-header',
  templateUrl: './sidebar-header.component.html',
  styleUrls: ['./sidebar-header.component.scss']
})
export class SidebarHeaderComponent implements OnInit {
  toggle:boolean = false;
  title: string = 'Inbox';
  chatAppName: string ;
  inboxType: string = 'open';
  isDisabled: boolean = true;

  subscription: Subscription;
  setButtonDisabilitySubscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private globalService: GlobalService,
    private chatSharedService: ChatSharedService
  ) {
    this.setButtonDisabilitySubscription = this.sharedService.getButtonDisability()
      .subscribe((chatsObj)=>{
        this.isDisabled = chatsObj.disability
      })
  }

  ngOnInit(): void {
    this.getchatAppName();
    this.isDisabled = true;

  }

  getchatAppName(){
    let role = this.globalService.getAgentRole();
    let agentId = localStorage.getItem('agentId')

    if(role == 'Operations'){
      if(agentId == 'operations@tmdone.com'){
        this.chatAppName = "patpatGO Driver Support - Demo"
      }else{
        this.chatAppName = "patpatGO Driver Support"
      }

    }else{
      this.chatAppName = "patpatGO - Online Support"
    }
  }


  changeToggle(){
    this.toggle = !this.toggle;
  }


  changeSidebarContent(title: string){
    this.inboxType = title;
    this.changeToggle();
    this.sharedService.setInboxType(title);
    this.sharedService.setCurrentInboxType(title);

    if(title == 'close'){
      this.title = 'Closed Chats';
    }else{
      this.title = 'Inbox';
    }
  }


  showAlert(){
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to close all the selected chats?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
       this.closeMulipleChats();
        // Swal.fire(
        //   'Closed!',
        //   'Chats have been closed.',
        //   'success'
        // )
      }
    })
  }


  closeMulipleChats(){
    this.chatSharedService.closeMultipleChats(this.sharedService.getCloseChats())
    this.isDisabled = true;
    this.sharedService.setCloseChatsArrEmpty();
    this.sharedService.setShowCheckbox(false)
  }


  selectChats(){
    this.isDisabled = false;
    this.sharedService.setShowCheckbox(true)
  }

}
