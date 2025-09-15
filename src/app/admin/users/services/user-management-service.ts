import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';

import { User } from '../../../../models/user.interface';
import { UserFormData } from '../../../../models/userform.interface';
import { AddUserDto } from '../../../../models/AddUserDto';
import { GetUserRolesDto } from '../../../../models/GetUserRolesDto';
import { ChangePasswordDto } from '../../../../models/ChangePasswordDto';
import { PagedUsersQuery } from '../../../../models/PagedUsersQuery';
import { DashboardDataService } from './dashboard-data.service';
import { Auth } from '../../../auth/auth';
import { Roles } from '../../../constants/constants';

export interface UserManagementContext {
  users: User[];
  roles: string[];
  dataSource: MatTableDataSource<User>;
  total: number;
  editMode: boolean;
  UserFormData: UserFormData;
  UpdateUserDto: any;
  form?: NgForm;
  paginator?: MatPaginator;
  sort?: MatSort;
  search?: string;
  defaultPageSize?: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private snackBar = inject(MatSnackBar);
  private dataService = inject(DashboardDataService);
  public auth = inject(Auth);

  loadUsers(context: UserManagementContext): void {
    const canSeeForm = this.auth.hasAnyRole([Roles.Admin, Roles.Supervisor]);

    if (canSeeForm) {
      // All users + sort/filter/search
      const pageIndex = context.paginator ? context.paginator.pageIndex : 0;
      const pageSize = context.paginator
        ? context.paginator.pageSize
        : context.defaultPageSize || 10;

      const sortBy = context.sort?.active || 'createdDate';
      const sortDir = (context.sort?.direction as 'asc' | 'desc') || 'desc';

      const query: PagedUsersQuery = {
        pageIndex,
        pageSize,
        sortBy,
        sortDir,
        search: context.search?.trim() || null,
      };

      this.dataService.getUsers(query).subscribe((usersApi) => {
        const transformedUsers = usersApi.items.map((userApi) => ({
          userId: userApi.userId,
          username: userApi.username.toLowerCase(),
          firstName: userApi.firstName,
          lastName: userApi.lastName,
          email: userApi.email,
          role: userApi.role,
          isActive: userApi.isActive,
        }));

        // context.users = [...transformedUsers];
        context.users.length = 0;
        context.users.push(...transformedUsers);
        context.dataSource.data = transformedUsers;
        context.total = usersApi.total;

        if (context.paginator) {
          context.paginator.length = usersApi.total;
        }
      });
    } else {
      // Single user
      this.dataService.getMe().subscribe((userApi) => {
        const userInfo = {
          userId: userApi.userId,
          username: userApi.username,
          firstName: userApi.firstName,
          lastName: userApi.lastName,
          email: userApi.email,
          role: userApi.role,
          isActive: userApi.isActive,
        };
        // context.users = [userInfo];
        context.users.length = 0;
        context.users.push(userInfo);

        context.dataSource.data = [userInfo];
        context.total = 1;
      });
    }
  }

  loadRoles(context: UserManagementContext): void {
    this.dataService.getRoles().subscribe({
      next: (apiRoles: GetUserRolesDto[]) => {
        const rolesArray = apiRoles.map((r) => r.role);
        context.roles.length = 0;
        context.roles.push(...rolesArray);
      },
      error: (error) => {
        console.error('Roles could not be loaded', error);
      },
    });
  }

  deleteUser(userId: number, context: UserManagementContext): void {
    this.dataService.deleteUser(userId).subscribe({
      next: (response) => {
        console.log('User deleted successfully:', response);
        this.loadUsers(context);
        this.snackBar.open('User deleted successfully!', 'Close', {
          duration: 1000,
        });
      },
      error: (error) => {
        console.log('Error:', error);
        this.snackBar.open('User could not be deleted', 'Close', {
          duration: 1000,
        });
      },
    });
  }

  onEditClick(user: User, context: UserManagementContext): void {
    context.editMode = true;

    context.UserFormData = {
      userId: user.userId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive,
      role: user.role,
      password: '',
      confirmPassword: '',
    };
  }

  onUserFormSubmit(
    form: NgForm,
    context: UserManagementContext,
    onResetCallback?: () => void,
  ): void {
    if (!form.valid) return;

    if (context.editMode) {
      if (
        this.auth.hasRole(Roles.Admin) &&
        context.UserFormData.password.trim()
      ) {
        if (
          context.UserFormData.password !== context.UserFormData.confirmPassword
        ) {
          this.snackBar.open('Passwords do not match', 'Close', {
            duration: 1500,
          });
          return;
        }
      }

      context.UpdateUserDto = {
        userId: context.UserFormData.userId,
        username: context.UserFormData.username,
        email: context.UserFormData.email,
        firstName: context.UserFormData.firstName,
        lastName: context.UserFormData.lastName,
        isActive: context.UserFormData.isActive,
        role: context.UserFormData.role,
      };

      this.dataService.editUser(context.UpdateUserDto).subscribe({
        next: () => {
          if (
            this.auth.hasRole(Roles.Admin) &&
            context.UserFormData.password.trim()
          ) {
            const changePassword: ChangePasswordDto = {
              userId: context.UserFormData.userId,
              newPassword: context.UserFormData.password,
            };

            this.dataService.changePassword(changePassword).subscribe({
              next: () =>
                this.snackBar.open('User and password updated', 'Close', {
                  duration: 1500,
                }),
              error: () =>
                this.snackBar.open(
                  'User updated, but password failed',
                  'Close',
                  {
                    duration: 1500,
                  },
                ),
            });
          } else {
            this.snackBar.open('User updated successfully', 'Close', {
              duration: 1500,
            });
          }

          if (onResetCallback) {
            onResetCallback();
          }
          this.loadUsers(context);
        },
        error: (error) => {
          console.error('Error:', error);
          this.snackBar.open('User could not be updated', 'Close', {
            duration: 1500,
          });
        },
      });
    } else {
      //CREATE USER
      if (!this.auth.hasRole(Roles.Admin)) {
        this.snackBar.open('Not allowed', 'Close', {
          duration: 1000,
        });
        return;
      }
      if (
        context.UserFormData.password !== context.UserFormData.confirmPassword
      ) {
        this.snackBar.open('Passwords do not match', 'Close', {
          duration: 1500,
        });
        return;
      }

      const addUserDto: AddUserDto = {
        username: context.UserFormData.username,
        email: context.UserFormData.email,
        firstName: context.UserFormData.firstName,
        lastName: context.UserFormData.lastName,
        password: context.UserFormData.password,
        role: context.UserFormData.role,
        isActive: context.UserFormData.isActive,
      };

      this.dataService.createUser(addUserDto).subscribe({
        next: (response) => {
          console.log('User created successfully:', response);
          this.snackBar.open('User created successfully!', 'Close', {
            duration: 1500,
          });
          if (onResetCallback) {
            onResetCallback();
          }
          this.loadUsers(context);
        },
        error: (error) => {
          console.error('Error:', error);
          this.snackBar.open('User could not be created', 'Close', {
            duration: 1500,
          });
        },
      });
    }
  }

  // Helper method to create a context object
  createContext(component: any): UserManagementContext {
    return {
      users: component.users,
      roles: component.roles,
      dataSource: component.dataSource,
      total: component.total,
      editMode: component.editMode,
      UserFormData: component.UserFormData,
      UpdateUserDto: component.UpdateUserDto,
      form: component.form,
      paginator: component.paginator,
      sort: component.sort,
      search: component.search,
      defaultPageSize: component.defaultPageSize,
    };
  }
}
