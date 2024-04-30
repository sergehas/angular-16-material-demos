import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoStickyComponent } from './demo-sticky.component';

describe('DemoStickyComponent', () => {
  let component: DemoStickyComponent;
  let fixture: ComponentFixture<DemoStickyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DemoStickyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemoStickyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
