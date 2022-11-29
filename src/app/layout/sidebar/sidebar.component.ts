import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  setInboxSubscription: Subscription;
  showInbox: boolean = true;

  constructor(
    private sharedService: SharedService
  ) {
    this.setInboxSubscription=this.sharedService.getCurrentInboxType().subscribe(
      title =>{
        if(title == 'open'){
          this.showInbox = true;
        }else{
          this.showInbox = false;
        }
      })
  }

  ngOnInit(): void {

  }



}
