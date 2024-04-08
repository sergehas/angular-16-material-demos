import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule, ProgressBarMode } from '@angular/material/progress-bar';

import { NotificationService } from 'src/app/core/services/notification.service';
import { Notification } from "src/app/models/notification";

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


  _progressMode: ProgressBarMode = "determinate";
  _progressColor = "primary";
  _progressValue = 20;

  get progressMode(): ProgressBarMode {
    return this._progressMode;
  }

  get progressColor(): string {
    return this._progressColor;
  }

  get progressValue(): number {
    return this._progressValue;
  }

  dismiss() {
    this.service.dismiss(this.notification);
  }
}
