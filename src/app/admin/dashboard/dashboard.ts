import { Component, NgModule, OnInit, ChangeDetectionStrategy, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from "../../shared/header/header";
import { User } from '../../../models/user.interface';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { DashboardDataService } from './dashboard-data.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { UserFormData } from '../../../models/userform.interface';
import { GetUserRolesDto } from '../../../models/GetUserRolesDto';
import { ChangePasswordDto } from '../../../models/ChangePasswordDto';
import { Auth } from '../../auth/auth';
import { Roles } from '../../constants/constants';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatCardModule, MatSelectModule, FormsModule, Header],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.Default,
})

export class Dashboard implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'username',
    'firstName',
    'lastName',
    'email',
    'role',
    'status'
  ];

  UserFormData = {
    userId: 0,
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    isActive: true,
    password: '',
    confirmPassword: ''
  };
 
  UpdateUserDto = {
    userId: 0,
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    isActive: true
  };

  private snackBar = inject(MatSnackBar);
  private dataService = inject(DashboardDataService);
  public auth = inject(Auth);

  @HostListener('document:click')
  onAnyClick() {
    this.auth.checkAndLogoutIfExpired();
  }

  roles: string[] = []
  Roles = Roles;
  users: User[] = [];  

  dataSource = new MatTableDataSource<User>();

  @ViewChild('userForm') form!: NgForm;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }  

  editMode: boolean = false;

  onResetClick(): void {
    const emptyForm: UserFormData = {
    userId: 0,
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    isActive: true,
    password: '',
    confirmPassword: ''
  };

  this.UserFormData = emptyForm;
  this.form.resetForm({ ...emptyForm });

  this.editMode = false;
  }

  get canSeeForm() {
    return this.auth.hasAnyRole([Roles.Admin, Roles.Supervisor]);
  }

  get canChangePassword() {
    return this.auth.hasRole(Roles.Admin);
  }
  
  get canChangeRole() {
    return this.auth.hasRole(Roles.Admin);
  }

  ngOnInit() {
    this.loadUsers();
    if (this.canChangeRole) {
      this.loadRoles();
    }
    if (this.auth.hasAnyRole([Roles.Admin, Roles.Supervisor])) {
      this.displayedColumns = [...this.displayedColumns, ('actions')];
    }
  }
  
    loadUsers() {
      if (this.canSeeForm) {
    this.dataService.getUsers().subscribe(usersApi => {
      const transformedUsers = usersApi.map(userApi => {
        return {
          userId: userApi.userId,
          username: userApi.username.toLowerCase(),
          firstName: userApi.firstName,
          lastName: userApi.lastName,
          email: userApi.email,
          role: userApi.role,
          isActive: userApi.isActive
        };
      });
      this.users = [...transformedUsers];
      this.dataSource.data = transformedUsers;
    });
  } else {
    this.dataService.getMe().subscribe(userApi => {
      const userInfo = {
        userId: userApi.userId,
        username: userApi.username,
        firstName: userApi.firstName,
        lastName: userApi.lastName,
        email: userApi.email,
        role: userApi.role,
        isActive: userApi.isActive
      };
      this.users = [userInfo];
      this.dataSource.data = [userInfo];
    });
  }
}

  loadRoles() {
    this.dataService.getRoles().subscribe({
      next: (apiRoles: GetUserRolesDto[]) => {
        this.roles = apiRoles.map(r => r.role);
      },
      error: error =>
      {
        console.error('Roles could not be loaded', error);
      }
    });
  }

  applyFilter(searchFilter: Event) {
    if (!this.canSeeForm) {
      return;
    }
    const filterValue = (searchFilter.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

    deleteUser(userId: number) {
      this.dataService.deleteUser(userId).subscribe({
        next: response =>
        { 
          console.log('User deleted successfully:', response);
          this.loadUsers(); 
          this.snackBar.open('User deleted successfully!', 'Close', {
            duration: 1000
          });
        } ,
        error: error =>
        {
          console.log('Error:', error);
          this.snackBar.open('User could not be deleted', 'Close', {
            duration: 1000
          });
        }
      });
  }

  onEditClick(user: User) {
    this.editMode = true;

    this.UserFormData = {
      userId: user.userId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive,
      role: user.role,
      password: '',
      confirmPassword: ''
    };
  }

  onUserFormSubmit(form: NgForm) {
    if (!form.valid) return;

    if (this.editMode) {

    if (this.auth.hasRole(Roles.Admin) && this.UserFormData.password.trim()) {
      if (this.UserFormData.password !== this.UserFormData.confirmPassword) {
        this.snackBar.open('Passwords do not match', 'Close', {
          duration: 1500
        });
        return;
      }
    }

      this.UpdateUserDto = {
        userId: this.UserFormData.userId,
        username: this.UserFormData.username,
        email: this.UserFormData.email,
        firstName: this.UserFormData.firstName,
        lastName: this.UserFormData.lastName,
        isActive: this.UserFormData.isActive,
        role: this.UserFormData.role,
      };
    
        this.dataService.editUser(this.UpdateUserDto).subscribe({
        next: () => 
          { 
            if (this.auth.hasRole(Roles.Admin) && this.UserFormData.password.trim()) {
              const changePassword: ChangePasswordDto = {
                userId: this.UserFormData.userId,
                newPassword: this.UserFormData.password
              };

              this.dataService.changePassword(changePassword).subscribe({
                next: () =>
                  this.snackBar.open('User and password updated', 'Close', { 
                    duration: 1500 
                  }),
                error: () =>
                  this.snackBar.open('User updated, but password failed', 'Close', {
                    duration: 1500
                  })
              });
            } else {
              this.snackBar.open('User updated successfully', 'Close', {
                duration: 1500
              });
            }

            this.onResetClick()
            this.loadUsers();
        } ,
        error: error => 
          { console.error('Error:', error);
          this.snackBar.open('User could not be updated', 'Close', {
            duration: 1500
        });
      }});

      } else {
        //CREATE USER
        if (!this.auth.hasRole(Roles.Admin)) {
          this.snackBar.open('Not allowed', 'Close', {
            duration: 1000
          });
          return;
        }
        if (this.UserFormData.password !== this.UserFormData.confirmPassword) {
          this.snackBar.open('Passwords do not match', 'Close', {
            duration: 1500
          });
          return;
        }
        
      this.dataService.createUser(this.UserFormData).subscribe({
        next: response => 
          { console.log('User created successfully:', response);
          this.onResetClick()
          this.loadUsers();
        } ,
        error: error => 
          { console.error('Error:', error);
          this.snackBar.open('User could not be created', 'Close', {
            duration: 1500
        });
      }});
      }      
    }
}
