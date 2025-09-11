import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersTable } from '../../components/users-table/users-table';

@Component({
  standalone: true,
  selector: 'app-users-table-read',
  imports: [CommonModule, UsersTable],
  templateUrl: './users-table-read.html',
  styleUrl: './users-table-read.css'
})
export class UsersTableRead {}
