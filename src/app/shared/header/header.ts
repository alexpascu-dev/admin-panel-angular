import { Component, signal, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Auth } from '../../auth/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  private auth = inject(Auth);
  private snackbar = inject(MatSnackBar);

  ngOnInit() {
    this.user_email.set(this.auth.getCurrentUserEmail());
    this.user_role.set(this.auth.getCurrentUserRole());
  }

  title = signal('🛠 Admin Panel');
  user_email = signal('');
  user_role = signal('');
  
    logoutBtn() {
    this.auth.logout();
    this.snackbar.open('You have been logged out.', 'Close', {
      duration: 2000
    });
  }
}