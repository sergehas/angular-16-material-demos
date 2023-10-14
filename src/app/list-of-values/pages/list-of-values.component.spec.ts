import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfValuesComponent } from './list-of-values.component';

describe('ListOfValuesComponent', () => {
  let component: ListOfValuesComponent;
  let fixture: ComponentFixture<ListOfValuesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListOfValuesComponent]
    });
    fixture = TestBed.createComponent(ListOfValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
