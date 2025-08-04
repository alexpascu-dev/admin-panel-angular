import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GetUserDto } from '../../../models/GetUserDto';
import { catchError, Observable } from 'rxjs';
import { AddUserDto } from '../../../models/AddUserDto';
import { UpdateUserDto } from '../../../models/UpdateUserDto';
import { User } from '../../../models/user.interface';


@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private apiUrl = 'http://localhost:5062/api/users';

  private http = inject(HttpClient);


  // GET METHOD
  getUsers(): Observable<GetUserDto[]> {
    return this.http.get<GetUserDto[]>(this.apiUrl);
  }

  // POST METHOD
  createUser(UserDataSent: AddUserDto): Observable<AddUserDto> {
    return this.http.post<AddUserDto>(this.apiUrl, UserDataSent);
  }

  //PUT METHOD
  editUser(user: UpdateUserDto): Observable<UpdateUserDto> {
    return this.http.put<UpdateUserDto>(this.apiUrl, user);
  }

  // DELETE METHOD
  deleteUser(id: number): Observable<unknown> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }  

}