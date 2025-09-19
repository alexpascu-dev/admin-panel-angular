import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GetUserDto } from '../../../../models/GetUserDto';
import { Observable } from 'rxjs';
import { AddUserDto } from '../../../../models/AddUserDto';
import { UpdateUserDto } from '../../../../models/UpdateUserDto';
import { GetUserRolesDto } from '../../../../models/GetUserRolesDto';
import { ChangePasswordDto } from '../../../../models/ChangePasswordDto';
import { PagedUsersQuery } from '../../../../models/PagedUsersQuery';
import { PagedResult } from '../../../../models/PagedResult';
import { apiUrl } from '../../../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class DashboardDataService {
  private apiUrl = apiUrl;

  private http = inject(HttpClient);

  // GET ALL USERS
  // getUsers(): Observable<GetUserDto[]> {
  //   return this.http.get<GetUserDto[]>(this.apiUrl);
  // }

  getUsers(query: PagedUsersQuery): Observable<PagedResult<GetUserDto>> {
    const url = `${apiUrl}/users/all-users`;

    let params = new HttpParams()
      .set('pageIndex', query.pageIndex)
      .set('pageSize', query.pageSize);

    if (query.sortBy) params = params.set('sortBy', query.sortBy);
    if (query.sortDir) params = params.set('sortDir', query.sortDir || 'asc');
    if (query.search) params = params.set('search', query.search!.trim());

    return this.http.get<PagedResult<GetUserDto>>(url, { params });
  }

  // GET USER INFO FROM TOKEN
  getMe(): Observable<GetUserDto> {
    const url = `${apiUrl}/users/me`;
    return this.http.get<GetUserDto>(url);
  }

  // GET ROLES API
  getRoles(): Observable<GetUserRolesDto[]> {
    const url = `${apiUrl}/users/roles`;
    return this.http.get<GetUserRolesDto[]>(url);
  }

  // POST METHOD
  createUser(UserDataSent: AddUserDto): Observable<AddUserDto> {
    const url = `${apiUrl}/users/register`;
    return this.http.post<AddUserDto>(url, UserDataSent);
  }

  //PUT METHOD
  editUser(user: UpdateUserDto): Observable<UpdateUserDto> {
    const url = `${apiUrl}/users/update`;
    return this.http.put<UpdateUserDto>(url, user);
  }

  //CHANGE PASSWORD
  changePassword(userDataSent: ChangePasswordDto) {
    const url = `${apiUrl}/users/update/change-password`;
    return this.http.put<ChangePasswordDto>(url, userDataSent);
  }

  // DELETE METHOD
  deleteUser(userId: number): Observable<unknown> {
    const url = `${apiUrl}/users/${userId}`;
    return this.http.delete(url);
  }



  // GET USERS REPORT PREVIEW
getReportPreview(startDate: string, endDate: string): Observable<any[]> {
  const url = `${apiUrl}/users/report-preview`;
  let params = new HttpParams()
    .set('startDate', startDate)
    .set('endDate', endDate);
  
  return this.http.get<any[]>(url, { params });
}

// EXPORT USERS REPORT
exportReport(startDate: string, endDate: string): Observable<Blob> {
  const url = `${apiUrl}/users/export-report`;
  let params = new HttpParams()
    .set('startDate', startDate)
    .set('endDate', endDate);
  
  return this.http.get(url, { 
    params,
    responseType: 'blob' 
  });
}
}
