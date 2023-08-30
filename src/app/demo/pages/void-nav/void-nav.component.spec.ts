import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidNavComponent } from './void-nav.component';

describe('VoidNavComponent', () => {
  let component: VoidNavComponent;
  let fixture: ComponentFixture<VoidNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoidNavComponent]
    });
    fixture = TestBed.createComponent(VoidNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
