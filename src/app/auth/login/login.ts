import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../../models/user.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../auth';
import { inject } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MatButtonModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private router = inject(Router);
  private auth = inject(Auth);

  loginForm = new FormGroup({
    username: new FormControl('',[
      Validators.required,
      Validators.minLength(1),
    ]),
    password: new FormControl('',[
      Validators.required,
      Validators.minLength(1)
    ])
  });

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  loginBtn() {
    if (this.loginForm.valid) {
      this.auth.login();
      //this.dataService.updateEmail();
      this.router.navigate(['/admin/dashboard']);
    }
  }

}

