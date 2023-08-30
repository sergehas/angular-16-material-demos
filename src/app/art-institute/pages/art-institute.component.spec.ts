import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtInstituteComponent } from './art-institute.component';

describe('ArtInstituteComponent', () => {
  let component: ArtInstituteComponent;
  let fixture: ComponentFixture<ArtInstituteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArtInstituteComponent]
    });
    fixture = TestBed.createComponent(ArtInstituteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
