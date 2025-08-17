import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private notificationsSource = new Subject<{ message: string, type: string }>();
  notifications$ = this.notificationsSource.asObservable();

  showNotification(message: string, type: string = 'success') {
    this.notificationsSource.next({ message, type });
  }
}
