import { Component, signal, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { Header } from './shared/header/header';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { Auth } from './auth/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatTableModule, Header, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnDestroy {
  protected readonly title = signal('admin-panel');
  showHeader = true;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private auth: Auth,
  ) {
    // Listen to route changes to conditionally show/hide header
    const routeSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateHeaderVisibility(event.url);
      });

    // Listen to authentication state changes
    const authSubscription = this.auth
      .getAuthenticationState()
      .subscribe((isAuthenticated: boolean) => {
        if (!isAuthenticated) {
          // If user is not authenticated, hide header
          this.showHeader = false;
        } else {
          // If authenticated, check the current route
          this.updateHeaderVisibility(this.router.url);
        }
      });

    this.subscriptions.push(routeSubscription, authSubscription);

    // Initial check
    this.updateHeaderVisibility(this.router.url);
  }

  private updateHeaderVisibility(url: string) {
    // Hide header on login route or if not authenticated
    this.showHeader = !url.includes('/auth/login') && this.auth.isLoggedIn();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
