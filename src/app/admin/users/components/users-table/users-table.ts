import {
  Component,
  NgModule,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
  HostListener,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../../models/user.interface';
import { inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Auth } from '../../../../auth/auth';
import { Roles } from '../../../../constants/constants';
import { UserManagementService } from '../../services/user-management-service';

@Component({
  standalone: true,
  selector: 'app-users-table',
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
  ],
  templateUrl: './users-table.html',
  styleUrl: './users-table.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UsersTable implements OnInit, AfterViewInit {
  @Output() editUser = new EventEmitter<User>();
  @Input() hideActions: boolean = false; // Input to control actions column visibility

  displayedColumns: string[] = [
    'username',
    'firstName',
    'lastName',
    'email',
    'role',
    'status',
  ];

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

  get canSeeForm() {
    return this.auth.hasAnyRole([Roles.Admin, Roles.Supervisor]);
  }

  get canChangeRole() {
    return this.auth.hasRole(Roles.Admin);
  }

  ngOnInit() {
    this.loadUsers();
    if (this.canChangeRole) {
      this.loadRoles();
    }
    // Add actions column only if user has permissions AND hideActions is false
    if (
      this.auth.hasAnyRole([Roles.Admin, Roles.Supervisor]) &&
      !this.hideActions
    ) {
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
    const confirmation = confirm('Are you sure you want to delete the user?');

    if (confirmation) {
      const context = this.userManagementService.createContext(this);
      this.userManagementService.deleteUser(userId, context);
    }
  }

  onEditClick(user: User) {
    this.editUser.emit(user);
  }

  applyFilter(searchFilter: Event) {
    if (!this.canSeeForm) return;
    const value = (searchFilter.target as HTMLInputElement).value ?? '';
    this.search = value.trim();
    this.paginator.firstPage();
    this.loadUsers();
  }
}
