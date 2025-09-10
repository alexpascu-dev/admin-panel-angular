import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GetUserDto } from '../../../models/GetUserDto';
import { Observable } from 'rxjs';
import { AddUserDto } from '../../../models/AddUserDto';
import { UpdateUserDto } from '../../../models/UpdateUserDto';
import { GetUserRolesDto } from '../../../models/GetUserRolesDto';
import { ChangePasswordDto } from '../../../models/ChangePasswordDto';
import { PagedUsersQuery } from '../../../models/PagedUsersQuery';
import { PagedResult } from '../../../models/PagedResult';


@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private apiUrl = 'http://209.38.254.238/api/users';

  private http = inject(HttpClient);


  // GET ALL USERS
  // getUsers(): Observable<GetUserDto[]> {
  //   return this.http.get<GetUserDto[]>(this.apiUrl);
  // }

  getUsers(query: PagedUsersQuery): Observable<PagedResult<GetUserDto>> {
    const url = `${this.apiUrl}/all-users`

    let params = new HttpParams()
      .set('pageIndex', query.pageIndex)
      .set('pageSize', query.pageSize);

    if (query.sortBy) params = params.set('sortBy', query.sortBy);
    if (query.sortDir) params = params.set('sortDir', query.sortDir || 'asc');
    if (query.search) params = params.set('search', query.search!.trim());

    return this.http.get<PagedResult<GetUserDto>>(url, { params })
  }

  // GET USER INFO FROM TOKEN
  getMe(): Observable<GetUserDto> {
    const url = `${this.apiUrl}/me`;
    return this.http.get<GetUserDto>(url);
  }

  // GET ROLES API
  getRoles(): Observable<GetUserRolesDto[]> {
    const url = `${this.apiUrl}/roles`;
    return this.http.get<GetUserRolesDto[]>(url);
  }

  // POST METHOD
  createUser(UserDataSent: AddUserDto): Observable<AddUserDto> {
    const url = `${this.apiUrl}/register`
    return this.http.post<AddUserDto>(url, UserDataSent);
  }

  //PUT METHOD
  editUser(user: UpdateUserDto): Observable<UpdateUserDto> {
    const url = `${this.apiUrl}/update`
    return this.http.put<UpdateUserDto>(url, user);
  }

  //CHANGE PASSWORD
  changePassword(userDataSent: ChangePasswordDto) {
    const url = `${this.apiUrl}/update/change-password`
    return this.http.put<ChangePasswordDto>(url, userDataSent);
  }

  // DELETE METHOD
  deleteUser(userId: number): Observable<unknown> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.delete(url);
  }
}