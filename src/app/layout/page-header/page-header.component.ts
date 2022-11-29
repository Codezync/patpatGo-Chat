import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { mobileNavigation } from 'src/app/store/navigation';
@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeaderComponent implements OnInit {
  

  constructor(private store: Store<any>) { }

  ngOnInit(): void {

  }

  openMobileNav($event: MouseEvent) {
    $event.preventDefault();
    this.store.dispatch(mobileNavigation({open: true}));
  }

}
