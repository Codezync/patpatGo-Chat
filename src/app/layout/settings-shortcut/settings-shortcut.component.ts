import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-settings-shortcut',
  templateUrl: './settings-shortcut.component.html',
  styleUrls: ['./settings-shortcut.component.scss']
})
export class SettingsShortcutComponent {

  constructor() { }

  toggleHideNavigation($event: MouseEvent) {
    $event.preventDefault();
    // this.store.dispatch(settings.toggleHideNavigation());
  }

  toggleMinifyNavigation($event: MouseEvent) {
    $event.preventDefault();
    // this.store.dispatch(settings.toggleMinifyNavigation());
  }

  toggleFixedNavigation($event: MouseEvent) {
    $event.preventDefault();
    // this.store.dispatch(settings.toggleFixedNavigation());
  }


}
