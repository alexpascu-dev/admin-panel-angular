import {
  Component,
  OnInit,
  AfterViewInit,
  Inject,
  ViewChild,
  inject,
  ChangeDetectorRef,
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
  title = '🛠️ Admin Panel';
  sidenavExpanded = true;
  isMobile = false;

  Roles = Roles;

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  private observer = inject(BreakpointObserver);
  private cdr = inject(ChangeDetectorRef);
  public auth = inject(Auth);
  private snackbar = inject(MatSnackBar);
  private router = inject(Router);

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    this.userDetailsEmail = this.auth.getCurrentUserEmail();
    this.userDetailsName = this.auth.getCurrentUsername();
    this.user_role = this.auth.getCurrentUserRole();
    this.document.body.classList.remove('backgroundimg');
  }

  ngAfterViewInit() {
    // Defer setup to next tick to avoid change detection issues
    setTimeout(() => {
      this.setupResponsiveBehavior();
      this.setupNavigationBehavior();
      this.loadSavedState();
    }, 0);
  }

  private setupResponsiveBehavior() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (this.isMobile !== res.matches) {
          this.isMobile = res.matches;
          this.handleModeChange();
        }
      });
  }

  private handleModeChange() {
    if (this.isMobile) {
      this.saveState();
      this.sidenav.mode = 'over';
      this.sidenav.close();
      this.sidenavExpanded = false;
    } else {
      this.sidenav.mode = 'side';
      this.sidenav.open();
      this.loadState();
    }
    this.cdr.detectChanges();
  }

  private setupNavigationBehavior() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMobile) {
          this.sidenav.close();
        }
      });
  }

  private loadSavedState() {
    this.loadState();
    setTimeout(() => {
      if (!this.isMobile) {
        this.sidenav.open();
      }
    }, 100);
  }

  private saveState() {
    if (!this.isMobile) {
      localStorage.setItem('sidenavExpanded', String(this.sidenavExpanded));
    }
  }

  private loadState() {
    const saved = localStorage.getItem('sidenavExpanded');
    const newExpanded = saved ? saved === 'true' : true;
    
    if (this.sidenavExpanded !== newExpanded) {
      this.sidenavExpanded = newExpanded;
      this.cdr.markForCheck();
    }
  }

  toggleSidenav() {
    if (this.isMobile) {
      this.sidenav.toggle();
    } else {
      this.sidenavExpanded = !this.sidenavExpanded;
      this.saveState();
      this.cdr.detectChanges();
      
      if (this.sidenavExpanded) {
        setTimeout(() => this.sidenav.open(), 150);
      } else {
        this.sidenav.open();
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
    const confirmation = confirm('Are you sure you want to logout?');

    if (confirmation) {
      this.auth.logout();
      this.snackbar.open('You have been logged out.', 'Close', {
        duration: 2000,
      });
    }
  }
}