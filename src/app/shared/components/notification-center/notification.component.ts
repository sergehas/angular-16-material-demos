import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

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

  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NotificationComponent {

  @Input() notif!: Notification;

  constructor(private service: NotificationService) {
  }

  dismiss() {
    this.service.dismiss(this.notif);
  }
}
