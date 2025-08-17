import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistWorksComponent } from './artist-works.component';

describe('ArtistWorksComponent', () => {
  let component: ArtistWorksComponent;
  let fixture: ComponentFixture<ArtistWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistWorksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
