import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule, ProgressBarMode } from '@angular/material/progress-bar';

import { NotificationService } from 'src/app/core/services/notification.service';
import { Notification, ProgressNotification } from "src/app/models/notification";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NotificationComponent {

  @Input() notification!: Notification;

  constructor(private service: NotificationService) {
  }

  //demo val
  _progressColor = "primary";

  get hasProgress(): boolean {
    return this.notification instanceof ProgressNotification;
  }
  get progressMode(): ProgressBarMode {
    if (this.hasProgress && (this.notification as ProgressNotification).progress.position.total > 0) {
      return "determinate"
    }
    return "indeterminate";
  }

  get progressColor(): string {
    return this._progressColor;
  }

  get progressValue(): number {
    if (this.hasProgress && (this.notification as ProgressNotification).progress.position.total > 0) {
      const p = (this.notification as ProgressNotification).progress.position;
      console.info(`progress is ${(p.value / p.total) * 100}`);
      return (p.value / p.total) * 100;
    }
    return -1;
  }

  dismiss() {
    this.service.dismiss(this.notification);
  }
}
