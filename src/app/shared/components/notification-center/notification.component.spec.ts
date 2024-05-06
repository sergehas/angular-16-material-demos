import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationService } from 'src/app/core/services/notification.service';

import { Notification } from 'src/app/core/models/notification';
import { NotificationComponent } from './notification.component';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async () => {
    const service = jasmine.createSpyObj('NotificationService', ['notify', 'dismiss', 'update']);


    await TestBed.configureTestingModule({
      imports: [NotificationComponent],
      providers: [{ provide: NotificationService, useValue: service }],

    })
      .compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    component.notification = new Notification({ severity: "info", message: "" });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
