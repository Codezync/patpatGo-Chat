import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { MainComponent } from './layout/main/main.component';
import { PageHeaderComponent } from './layout/page-header/page-header.component';
import { PageFooterComponent } from './layout/page-footer/page-footer.component';
import { DropdownUserComponent } from './layout/dropdown-user/dropdown-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgbModule,NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers, effects } from './store';
import { EffectsModule } from '@ngrx/effects';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SettingsShortcutComponent } from './layout/settings-shortcut/settings-shortcut.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatRoomComponent } from './chat/components/chat-room/chat-room.component';
import { MessageComponent } from './chat/components/message/message.component';
import { ChatListComponent } from './chat/components/chat-list/chat-list.component';
import { ChatHeaderComponent } from './chat/components/chat-header/chat-header.component';
import { SidebarHeaderComponent } from './layout/sidebar-header/sidebar-header.component';
import { ChatInputComponent } from './chat/components/chat-input/chat-input.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireStorageModule} from '@angular/fire/storage'
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { UrlifyPipe } from './chat/pipes/urlify.pipe';
import { MediaViewComponent } from './chat/components/media-view/media-view.component';
import { CloseChatListComponent } from './chat/components/close-chat-list/close-chat-list.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { SigninComponent } from './authentication/signin/signin.component';
import { AuthService } from './authentication/_services/auth.service';
import { appInitializer } from './authentication/_helpers/app.initializer';
import { JwtInterceptor } from './authentication/_helpers/jwt.interceptor';
import { ErrorInterceptor } from './authentication/_helpers/error.interceptor';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// import { reducers, metaReducers, effects } from './store';
@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    MainComponent,
    PageHeaderComponent,
    PageFooterComponent,
    DropdownUserComponent,
    SettingsShortcutComponent,
    ChatRoomComponent,
    MessageComponent,
    ChatListComponent,
    ChatHeaderComponent,
    SidebarHeaderComponent,
    ChatInputComponent,
    UrlifyPipe,
    MediaViewComponent,
    CloseChatListComponent,
    SigninComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    Ng2SearchPipeModule,
    ModalModule.forRoot(),
    CommonModule,
    ModalModule.forRoot(),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
        strictStateSerializability: false,
        strictActionSerializability: false,
      },
    }),
    EffectsModule.forRoot([...effects]),

    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    BrowserAnimationsModule,
    NgbModalModule,
    PickerModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    InfiniteScrollModule
  ],
  providers: [
    DatePipe,
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthService] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: FirestoreSettingsToken, useValue: { experimentalAutoDetectLongPolling: true }}
  ],
  bootstrap: [AppComponent],

  entryComponents: [MediaViewComponent]
})
export class AppModule { }
