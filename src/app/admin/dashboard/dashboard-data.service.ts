import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UserApi } from '../../../models/user-api.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private http = inject(HttpClient);

  getUsers(): Observable<UserApi[]> {
    return this.http.get<UserApi[]>('https://jsonplaceholder.typicode.com/users');
  }
}
