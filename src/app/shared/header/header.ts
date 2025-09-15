import {
  Component,
  OnInit,
  AfterViewInit,
  Inject,
  ViewChild,
  inject,
} from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
import { CommonModule } from '@angular/common';
import { Roles } from '../../constants/constants';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
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

  Roles = Roles;

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  private observer = inject(BreakpointObserver);
  public auth = inject(Auth);
  private snackbar = inject(MatSnackBar);
  private router = inject(Router);

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    // Get user details
    this.userDetailsEmail = this.auth.getCurrentUserEmail();
    this.userDetailsName = this.auth.getCurrentUsername();
    this.user_role = this.auth.getCurrentUserRole();
    this.document.body.classList.remove('backgroundimg');
  }

  ngAfterViewInit() {
    this.setupResponsiveBehavior();
    this.setupNavigationBehavior();
    this.loadSavedState();
  }

  private setupResponsiveBehavior() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        const wasMobile = this.isMobile;
        this.isMobile = res.matches;

        if (this.isMobile !== wasMobile) {
          this.handleModeChange();
        }
      });
  }

  private handleModeChange() {
    if (this.isMobile) {
      // Save desktop state before switching to mobile
      this.saveDesktopState();
      // Switch to mobile mode
      this.sidenav.mode = 'over';
      this.sidenav.close();
      this.sidenavExpanded = false;
    } else {
      // Switch to desktop mode
      this.sidenav.mode = 'side';
      this.sidenav.open();
      this.restoreDesktopState();
    }
  }

  private setupNavigationBehavior() {
    // Close sidenav on navigation (mobile only)
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMobile) {
          this.sidenav.close();
        }
      });
  }

  private loadSavedState() {
    const savedState = localStorage.getItem('sidenavExpanded');
    if (savedState && !this.isMobile) {
      this.sidenavExpanded = savedState === 'true';
    }
    
    // Ensure proper initial state
    setTimeout(() => {
      if (!this.isMobile) {
        this.sidenav.open();
      }
    }, 100);
  }

  private saveDesktopState() {
    if (!this.isMobile) {
      localStorage.setItem('sidenavExpanded', String(this.sidenavExpanded));
    }
  }

  private restoreDesktopState() {
    const savedState = localStorage.getItem('sidenavExpanded');
    this.sidenavExpanded = savedState ? savedState === 'true' : true;
  }

  toggleSidenav() {
    if (this.isMobile) {
      this.sidenav.toggle();
    } else {
      this.sidenavExpanded = !this.sidenavExpanded;
      this.saveDesktopState();
      
      if (!this.sidenavExpanded) {
        // Collapsing: keep sidenav open but visually collapsed
        this.sidenav.open();
      } else {
        // Expanding: add slight delay for smooth animation
        setTimeout(() => this.sidenav.open(), 150);
      }
    }
  }

  toggleMobileMenu() {
    this.sidenav.toggle();
  }

  closeMobileMenu() {
    this.sidenav.close();
  }

  Logout() {
    this.auth.logout();
    this.snackbar.open('You have been logged out.', 'Close', {
      duration: 2000,
    });
  }
}