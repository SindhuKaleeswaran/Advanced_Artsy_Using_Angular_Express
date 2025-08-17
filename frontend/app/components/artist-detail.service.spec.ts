import { TestBed } from '@angular/core/testing';

import { ArtistDetailService } from './artist-detail.service';

describe('ArtistDetailService', () => {
  let service: ArtistDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtistDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
