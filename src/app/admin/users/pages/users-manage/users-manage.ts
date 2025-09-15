import { Component, ViewChild } from '@angular/core';
import { UsersTable } from '../../components/users-table/users-table';
import { UserForm } from '../../components/user-form/user-form';
import { CommonModule } from '@angular/common';
import { User } from '../../../../../models/user.interface';
import { inject } from '@angular/core';
import { Auth } from '../../../../auth/auth';
import { Roles } from '../../../../constants/constants';

@Component({
  selector: 'app-users-manage',
  imports: [UsersTable, UserForm, CommonModule],
  templateUrl: './users-manage.html',
  styleUrl: './users-manage.css',
  standalone: true,
})
export class UsersManage {
  @ViewChild(UserForm) userFormComponent!: UserForm;
  @ViewChild(UsersTable) usersTableComponent!: UsersTable;

  public auth = inject(Auth);
  Roles = Roles;

  get canSeeForm() {
    return this.auth.hasAnyRole([Roles.Admin, Roles.Supervisor]);
  }

  onEditUser(user: User) {
    // When edit is clicked in users-table, populate the user-form
    this.userFormComponent.populateFormForEdit(user);
  }

  onUserUpdated() {
    // When user is updated in user-form, refresh the users-table
    this.usersTableComponent.loadUsers();
  }

  onUserCreated() {
    // When user is created in user-form, refresh the users-table
    this.usersTableComponent.loadUsers();
  }
}
