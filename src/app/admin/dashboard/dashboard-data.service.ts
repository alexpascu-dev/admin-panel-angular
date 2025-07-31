import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GetUserDto } from '../../../models/GetUserDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private http = inject(HttpClient);

  getUsers(): Observable<GetUserDto[]> {
    return this.http.get<GetUserDto[]>('http://localhost:5062/api/users');
  }
}
