import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { LoginDto } from '../../../models/LoginDto';
import { FormsModule, NgForm } from '@angular/forms';
import { Auth } from '../auth';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private router = inject(Router);
  private auth = inject(Auth);
  private snackBar = inject(MatSnackBar);

  LoginData: LoginDto = {
    username: '',
    password: ''
  };

  loginBtn(form: NgForm) {
    if (form.valid) {
      this.auth.login(this.LoginData).subscribe({
        next: response =>
        {
          console.log('User logged in successfully:');
          this.snackBar.open('Log in successfully!', 'Close', {
            duration: 1000
          });
          setTimeout(() => {
            this.router.navigate(['/admin/users']);
          }, 100);
        },
        error: error =>
        {
          console.log('Error:', error);
          this.snackBar.open('Wrong credentials', 'Close', {
            duration: 1000
          });
        }
      });        
      }
    }
  }