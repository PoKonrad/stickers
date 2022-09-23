import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickerSetComponent } from './sticker-set.component';

describe('StickerSetComponent', () => {
  let component: StickerSetComponent;
  let fixture: ComponentFixture<StickerSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StickerSetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StickerSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
