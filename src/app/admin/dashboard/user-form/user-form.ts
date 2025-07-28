import { Component , NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../../models/user.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserForm {

  // username = new FormControl('');
  // email
  // firstname = new FormControl('');
  // lastName = new FormControl('');
  // password
  // confirmPassword





  onSaveUser(event: Event) {
    event.preventDefault();

    console.log('test')
  }
}
