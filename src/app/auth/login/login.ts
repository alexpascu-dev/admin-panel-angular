import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { LoginDto } from '../../../models/LoginDto';
import { FormsModule, NgForm } from '@angular/forms';
import { Auth } from '../auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MatButtonModule, MatInputModule, FormsModule, TranslateModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, OnDestroy {
  private router = inject(Router);
  private auth = inject(Auth);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);
  private destroy$ = new Subject<void>();

  LoginData: LoginDto = { username: '', password: '' };
  currentLang = 'en';
  isLoading = false;

  ngOnInit(): void {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    if (savedLang !== 'en') this.switchLanguage(savedLang);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  switchLanguage(lang: string): void {
    console.log('Switching to language:', lang);
    this.currentLang = lang;
    this.translate.use(lang).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        console.log('Language switched successfully to:', lang);
        localStorage.setItem('preferredLanguage', lang);
      },
      error: (error) => {
        console.warn('Translation loading failed for language:', lang, error);
        if (lang !== 'en') this.switchLanguage('en');
      },
    });
  }

  loginBtn(form: NgForm) {
    if (!form.valid || this.isLoading) return;
    
    this.isLoading = true;
    this.auth.login(this.LoginData).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        console.log('User logged in successfully');
        this.showMessage('LOGIN.LOGIN_SUCCESS', 2000);
        setTimeout(() => this.router.navigate(['/admin/users']), 100);
      },
      error: (error) => {
        console.log('Login error:', error);
        this.isLoading = false;
        this.showMessage('LOGIN.WRONG_CREDENTIALS', 3000);
      },
    });
  }

  private showMessage(key: string, duration: number): void {
    this.translate.get(key).pipe(takeUntil(this.destroy$))
      .subscribe(message => this.snackBar.open(message, 'Close', { duration }));
  }
}