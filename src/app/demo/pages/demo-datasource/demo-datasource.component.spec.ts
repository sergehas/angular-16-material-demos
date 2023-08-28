import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoDatasourceComponent } from './demo-datasource.component';

describe('DemoDatasourceComponent', () => {
  let component: DemoDatasourceComponent;
  let fixture: ComponentFixture<DemoDatasourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemoDatasourceComponent]
    });
    fixture = TestBed.createComponent(DemoDatasourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
