import {
  Component,
  OnInit,
  AfterViewInit,
  Inject,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay, filter } from 'rxjs';
import { Auth } from '../../auth/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
    RouterModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
  host: {
    '[class.collapsed]': '!sidenavExpanded',
  },
})
export class Header implements OnInit, AfterViewInit {
  userDetailsEmail = '';
  userDetailsName = '';
  user_role = '';
  title = '🛠 Admin Panel';
  sidenavExpanded = true;
  isMobile = false;

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  constructor(
    private observer: BreakpointObserver,
    @Inject(DOCUMENT) private document: Document,
    private auth: Auth,
    private snackbar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Get user details
    this.userDetailsEmail = this.auth.getCurrentUserEmail();
    this.userDetailsName = this.auth.getCurrentUsername();
    this.user_role = this.auth.getCurrentUserRole();
    this.document.body.classList.remove('backgroundimg');
  }

  toggleSidenav() {
    if (this.isMobile) {
      // On mobile, just toggle the sidenav open/close
      this.sidenav.toggle();
    } else {
      // On desktop, toggle the expanded state
      if (this.sidenavExpanded) {
        this.sidenav.open();
        this.sidenavExpanded = false;
      } else {
        this.sidenavExpanded = true;
        setTimeout(() => {
          this.sidenav.open();
        }, 150);
      }
      localStorage.setItem(
        'desktopSidenavExpanded',
        String(this.sidenavExpanded),
      );
    }
  }

  toggleMobileMenu() {
    this.sidenav.toggle();
  }

  closeMobileMenu() {
    this.sidenav.close();
  }

  ngAfterViewInit() {
    // Responsive sidenav behavior
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        const wasMobile = this.isMobile;
        this.isMobile = res.matches;

        if (this.isMobile) {
          // Save desktop state before switching to mobile
          if (!wasMobile) {
            localStorage.setItem(
              'desktopSidenavExpanded',
              String(this.sidenavExpanded),
            );
          }
          // Mobile: use over mode (overlay), start closed, force collapsed state
          this.sidenav.mode = 'over';
          this.sidenav.close();
          this.sidenavExpanded = false; // Force collapsed state on mobile
        } else {
          // Desktop: use side mode, restore saved desktop state
          this.sidenav.mode = 'side';
          this.sidenav.open();
          // Restore saved desktop expanded state
          const savedDesktopState = localStorage.getItem(
            'desktopSidenavExpanded',
          );
          if (savedDesktopState !== null) {
            this.sidenavExpanded = savedDesktopState === 'true';
          } else {
            // Default desktop state
            this.sidenavExpanded = true;
          }
        }
      });

    // Close sidenav on navigation (mobile only)
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
          this.sidenavExpanded = false;
        }
      });

    // Ensure sidenav is expanded by default on desktop
    setTimeout(() => {
      if (this.sidenav.mode === 'side') {
        this.sidenav.open();
        this.sidenavExpanded = true;
      }
    }, 100);

    // Load saved state from localStorage
    const savedState = localStorage.getItem('sidenavExpanded');
    if (savedState) {
      this.sidenavExpanded = savedState === 'true';
      if (!this.sidenavExpanded && this.sidenav.mode === 'side') {
        this.sidenav.open(); // Keep it open even if collapsed
      }
    }
  }

  Logout() {
    this.auth.logout();
    this.snackbar.open('You have been logged out.', 'Close', {
      duration: 2000,
    });
  }
}
