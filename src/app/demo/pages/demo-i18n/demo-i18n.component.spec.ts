import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoI18nComponent } from './demo-i18n.component';

describe('DemoI18nComponent', () => {
  let component: DemoI18nComponent;
  let fixture: ComponentFixture<DemoI18nComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemoI18nComponent]
    });
    fixture = TestBed.createComponent(DemoI18nComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
