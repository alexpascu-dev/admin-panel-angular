import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private loggedIn = false;
  
  login() {
    this.loggedIn = true;
  }

  logout() {
    this.loggedIn = false;
  }

   isAuthenticated(): boolean {
     return this.loggedIn;
   }
}
