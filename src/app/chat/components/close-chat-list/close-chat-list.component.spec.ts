import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseChatListComponent } from './close-chat-list.component';

describe('CloseChatListComponent', () => {
  let component: CloseChatListComponent;
  let fixture: ComponentFixture<CloseChatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseChatListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseChatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
