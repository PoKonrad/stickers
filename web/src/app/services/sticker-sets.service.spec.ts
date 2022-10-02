import { TestBed } from '@angular/core/testing';

import { StickerSetsService } from './sticker-sets.service';

describe('StickerSetsService', () => {
  let service: StickerSetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StickerSetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
