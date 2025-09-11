import {
  Component,
  NgModule,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.interface';
import { FormsModule, NgForm } from '@angular/forms';
import { inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserFormData } from '../../../models/userform.interface';
import { Auth } from '../../auth/auth';
import { Roles } from '../../constants/constants';
import { UserManagementService } from './services/user-management-service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    FormsModule,
  ],
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
    'status',
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
    confirmPassword: '',
  };

  UpdateUserDto = {
    userId: 0,
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    isActive: true,
  };

  public auth = inject(Auth);
  private userManagementService = inject(UserManagementService);

  @HostListener('document:click')
  onAnyClick() {
    this.auth.checkAndLogoutIfExpired();
  }

  roles: string[] = [];
  Roles = Roles;
  users: User[] = [];

  dataSource = new MatTableDataSource<User>();
  private search = '';
  private defaultPageSize = 10;
  total = 0;

  @ViewChild('userForm') form!: NgForm;
  @ViewChild('filterInput') filterInput!: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    // Sorting Changes => reset to first page and reload users
    this.sort.sortChange.subscribe(() => {
      this.paginator.firstPage();
      this.loadUsers();
    });

    // When page changes => load users
    this.paginator.page.subscribe(() => this.loadUsers());

    // First load
    this.paginator.pageSize = this.defaultPageSize;
    this.loadUsers();
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
      confirmPassword: '',
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
      this.displayedColumns = [...this.displayedColumns, 'actions'];
    }
  }

  loadUsers() {
    const context = this.userManagementService.createContext(this);
    this.userManagementService.loadUsers(context);
    this.users = context.users;
    this.total = context.total;
  }

  loadRoles() {
    const context = this.userManagementService.createContext(this);
    this.userManagementService.loadRoles(context);
    this.roles = context.roles;
  }

  deleteUser(userId: number) {
    const context = this.userManagementService.createContext(this);
    this.userManagementService.deleteUser(userId, context);
  }

  onEditClick(user: User) {
    const context = this.userManagementService.createContext(this);
    this.userManagementService.onEditClick(user, context);

    this.editMode = context.editMode;
    this.UserFormData = { ...context.UserFormData };
  }

  onUserFormSubmit(form: NgForm) {
    const context = this.userManagementService.createContext(this);
    this.userManagementService.onUserFormSubmit(form, context, () =>
      this.onResetClick(),
    );
  }

  applyFilter(searchFilter: Event) {
    if (!this.canSeeForm) return;
    const value = (searchFilter.target as HTMLInputElement).value ?? '';
    this.search = value.trim();
    this.paginator.firstPage();
    this.loadUsers();
  }
}
