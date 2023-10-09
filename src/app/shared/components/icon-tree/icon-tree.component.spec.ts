import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconTreeComponent } from './icon-tree.component';

describe('IconTreeComponent', () => {
  let component: IconTreeComponent;
  let fixture: ComponentFixture<IconTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IconTreeComponent]
    });
    fixture = TestBed.createComponent(IconTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
