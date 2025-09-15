import { Component } from '@angular/core';
import { UserForm } from '../../components/user-form/user-form';

@Component({
  selector: 'app-users-create',
  imports: [UserForm],
  templateUrl: './users-create.html',
  styleUrl: './users-create.css',
  standalone: true
})
export class UsersCreate {

}
