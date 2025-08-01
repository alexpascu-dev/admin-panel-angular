import { Component, NgModule, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { App } from "../../app";
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
import { MatTableModule } from '@angular/material/table';
import { transform } from 'typescript';
import { UserFormData } from '../../../models/userform.interface';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatIconModule, MatCardModule, FormsModule, App, Header],
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

  UserFormData = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  };

  get UserDataSent() {
    const { confirmPassword, ... UserDataSent } = this.UserFormData;
    return UserDataSent;
  }

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
        console.log('DEBUG API:', usersApi);
      const transformedUsers = usersApi.slice(0,6).map(userApi => {
        return {
          id: userApi.userId,
          username: userApi.username.toLowerCase(),
          firstName: userApi.firstName,
          lastName: userApi.lastName,
          email: userApi.email,
          // status: true
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
  

    deleteUser(id: number) {
      this.dataService.deleteUser(id).subscribe({
        next: response =>
        { 
          console.log('User deleted successfully:', response);
          this.addedUserIds.delete(id);
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

    //return ok
    //loadUsers()

    //return nok
    //popup de eroare
    

   createNewUser(form: NgForm) {
    if (!form.valid) return;

   this.dataService.createUser(this.UserDataSent).subscribe({
    next: response => 
      { console.log('User created successfully:', response); 
      form.resetForm();
      this.loadUsers();
    } ,
    error: error => 
      { console.error('Error:', error);
      this.snackBar.open('User could not be created', 'Close', {
        duration: 1500
    });
  }});
  }
  
    //return ok
    //loadUsers()

    //return nok
    //popup eroare
}
