import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-image-view',
  templateUrl: './media-view.component.html',
  styleUrls: ['./media-view.component.scss']
})
export class MediaViewComponent implements OnInit {
  @Input() public url:any;
  @Input() public mediaType: any;

  constructor(private modalService: NgbModal) { }


  ngOnInit(): void {
  }

  closeModal(){
    this.modalService.dismissAll();
  }

}
