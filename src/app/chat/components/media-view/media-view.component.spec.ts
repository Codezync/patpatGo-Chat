import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaViewComponent } from './media-view.component';

describe('ImageViewComponent', () => {
  let component: MediaViewComponent;
  let fixture: ComponentFixture<MediaViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
