import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsShortcutComponent } from './settings-shortcut.component';

describe('SettingsShortcutComponent', () => {
  let component: SettingsShortcutComponent;
  let fixture: ComponentFixture<SettingsShortcutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsShortcutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsShortcutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
