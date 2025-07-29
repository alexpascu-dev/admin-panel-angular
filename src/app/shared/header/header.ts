import { Component, signal, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Auth } from '../../auth/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { DashboardDataService } from '../../admin/dashboard/dashboard-data.service';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  private router = inject(Router);
  private auth = inject(Auth);
  private snackbar = inject(MatSnackBar);
  private dataService = inject(DashboardDataService);

  ngOnInit() {
    this.adminEmail();
  }

  title = signal('🛠 Admin Panel');
  admin_email = signal('');
  
  adminEmail() {
    this.dataService.getUsers().subscribe({

      next: users => {
      if (users[0] !== null && users[0].email !== null) {
        this.admin_email.set(users[0]?.email);
      }
      else {
        this.admin_email.set('backup@email.com');
      }
    },

    error: err => {
      console.error('API error: ', err);
      this.admin_email.set('backup@email.com');
    },

    complete: () => {
      console.log('Request finalized without errors.')
    } 
  });
  }

    logoutBtn() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
    this.snackbar.open('You have been logged out.', 'Close', {
      duration: 2000
    });
  }
}