import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-notifications',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  message: string | null = null;
  type: string = 'success';
  constructor(private notificationsService: NotificationsService) {}

  ngOnInit() {
    this.message = sessionStorage.getItem('notification');
    this.type = this.message ? 'danger' : 'success';

    if (this.message) {
      setTimeout(() => {
        this.message = null;
        sessionStorage.removeItem('notification');
      }, 1500);
    }
    this.notificationsService.notifications$.subscribe(notification => {
      this.message = notification.message;
      this.type = notification.type;
      setTimeout(() => {
        this.message = null;
      }, 1500);
    });
  }
}
