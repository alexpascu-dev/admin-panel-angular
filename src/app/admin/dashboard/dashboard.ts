import { Component, NgModule, signal, OnInit, ChangeDetectionStrategy, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { App } from "../../app";
import { Header } from "../../shared/header/header";
import { User } from '../../../models/user.interface';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { DashboardDataService } from './dashboard-data.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { transform } from 'typescript';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatToolbarModule, MatIconModule, MatCardModule, FormsModule, App, Header],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.Default,
})

export class Dashboard implements OnInit {

    displayedColumns: string[] = [
  'id',
  'username',
  'firstName',
  'lastName',
  'email',
  'status',
  'actions'
  ];

  private snackBar = inject(MatSnackBar);
  private dataService = inject(DashboardDataService);

  users: User[] = [];
  allUsers: User[] = [];

  statusFilter: string = '0';
  addedUserIds: Set<number> = new Set();

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
        console.log('DEBUG API:', usersApi); // vezi structura reală
      const transformedUsers = usersApi.slice(0,5).map(userApi => {
        return {
          id: userApi.userId,
          username: userApi.username.toLowerCase(),
          firstName: userApi.firstName,
          lastName: userApi.lastName,
          email: userApi.email,
          status: Math.random() < 0.5
        };
      });
      this.users = [...transformedUsers];
      this.allUsers = [...transformedUsers];
      this.addedUserIds = new Set(transformedUsers.map(user => user.id));
    });
  }

    //check server return status
    // if 200 - OK
    // another status - NOK 


  addUser() {
    const nextUser = this.allUsers.find(user => !this.addedUserIds.has(user.id));

    if (nextUser) {
      this.users = [...this.users, nextUser].sort((a,b) => a.id - b.id);
      this.addedUserIds.add(nextUser.id);
    } 
    else {
      this.snackBar.open('All users have been added!', 'Close', {
        duration: 2000
      });
    }
  }

    //if status 200 
    // loadUsers

    //else popupError

  
  // TODO EDIT
  editUser(user: User) {
    console.log('Edit user:', user);
  }

    //return ok
    // refresh list with users
    // clean edit form

    //return nok
    //popup error
    //don't clear edit fields
  

  deleteUser(user: User) {
    this.users = this.users.filter(u => u.id !== user.id)
    this.addedUserIds.delete(user.id);
    this.snackBar.open('User has been deleted', 'Close', {
      duration: 1000
    });
  }

    //return ok
    //loadUsers()

    //return nok
    //popup de eroare

  public createUser(user: User): void {
    this.allUsers.push(user);
  }
    //return ok
    //loadUsers()

    //return nok
    //popup eroare
}
