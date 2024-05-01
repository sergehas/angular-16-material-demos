import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { NotificationService } from 'src/app/core/services/notification.service';
import { Notification } from 'src/app/models/notification';
import { NotificationCenterComponent } from './notification-center.component';

describe('NotificationCenterComponent', () => {
  let component: NotificationCenterComponent;
  let fixture: ComponentFixture<NotificationCenterComponent>;
  let service: Partial<NotificationService>;

  beforeEach(() => {
    const n = new Notification({ severity: "info", message: "fake" });
    service = {
      notification$: of(n)
    }
    //const getNotification$Spy = service.notification$.and.returnValue(of(n));
    TestBed.configureTestingModule({
      imports: [NotificationCenterComponent],
      providers: [{ provide: NotificationService, useValue: service }],

    });
    fixture = TestBed.createComponent(NotificationCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
