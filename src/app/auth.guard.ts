import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      // Check if token exists in localStorage
      this.router.navigate(['/dashboard']); // Redirect to dashboard if logged in
      return false; // Prevent access to the login page
    }
    return true; // Allow access if no token
  }
}
