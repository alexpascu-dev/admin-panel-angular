import { Component, NgModule, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { App } from "../../app";
import { Header } from "../../shared/header/header";
import { UserForm } from './user-form/user-form';
import { User } from '../../../models/user.interface';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { DashboardDataService } from './dashboard-data.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, App, Header, UserForm],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard implements OnInit {

  private snackBar = inject(MatSnackBar);
  private dataService = inject(DashboardDataService);

  users: User[] = [];
  allUsers: User[] = [];

  statusFilter: string = '0';

  addedUserIds: Set<number> = new Set();

  // readonly filters: ((user: User) => boolean)[] = [
  //   () => true,
  //   (user: User) => user.status === true,
  //   (user: User) => user.status === false
  // ];

  // get visibleUsers(): User[] {
  //   return this.users.filter(this.filters[+this.statusFilter]);
  // }

  get visibleUsers(): User[] {
    if (this.statusFilter === '0') {
      return this.users;
    }
    else if (this.statusFilter === '1') {
      return this.users.filter(user => user.status === true);
    } else {
      return this.users.filter(user => user.status === false);
    }
  }

  ngOnInit() {
    this.loadUsers()
  }

  loadUsers() {
    this.dataService.getUsers().subscribe(usersApi => {
      const transformedUsers = usersApi.slice(0,4).map(userApi => {
        const [firstName, ...remainder] = userApi.name.split(' ');
        const lastName = remainder.join(' ') || ('');
        return {
          id: userApi.id,
          username: userApi.username.toLowerCase(),
          firstName: firstName,
          lastName: lastName,
          email: userApi.email,
          status: Math.random() < 0.5
        };
      });
      this.users = [...transformedUsers]
      this.allUsers = [...transformedUsers]
      this.addedUserIds = new Set(transformedUsers.map(user => user.id))
    })
  }

  addUser() {

    const nextUser = this.allUsers.find(user => !this.addedUserIds.has(user.id));

    if (nextUser) {
      this.users = [...this.users, nextUser].sort((a, b) => a.id - b.id);
      this.addedUserIds.add(nextUser.id);
    }

    else {
      this.snackBar.open('All users have been added!', 'Close', {
        duration: 2000
      });
      }
  }

  editUser(user: User) {
    console.log('Edit user:', user);
  }

  deleteUser(user: User) {
    this.users = this.users.filter(u => u.id !== user.id);
    this.addedUserIds.delete(user.id);
    this.snackBar.open('User has been deleted', 'Close', {
      duration: 1000
    });
  }

    displayedColumns: string[] = [
  'id',
  'username',
  'firstName',
  'lastName',
  'email',
  'status',
  'actions'
  ];

}
