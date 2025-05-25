import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  username: string = ''; // Variable to store the user's name

  constructor(private router: Router, private location: Location) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token'); // Check for token in localStorage
      if (!token) {
        this.router.navigate(['/login']); // Redirect to login if no token
      } else {
        this.location.replaceState('/dashboard'); // Replace history to prevent back navigation
        this.username = localStorage.getItem('username') || 'Guest'; // Retrieve the user's name
      }
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token'); // Clear the token
      localStorage.removeItem('userName'); // Clear the user's name
    }
    this.router.navigate(['/login']); // Redirect to login page
  }

  navigateToProfile() {
  const username = localStorage.getItem('username'); // Get the username from localStorage
  if (!username) {
    console.error('Username not found in localStorage');
    return;
  }
  this.router.navigate(['/profile',username]); // Navigate to profile page with username]);
}

  navigateToPosts() {
    const username = localStorage.getItem('username'); // Get the username from localStorage
  if (!username) {
    console.error('Username not found in localStorage');
    return;
  }
    this.router.navigate(['/manageposts',username]); // Navigate to posts page
  }

  navigateToSettings() {
    this.router.navigate(['/settings']); // Navigate to settings page
  }

  navigateToAllPosts() {
    this.router.navigate(['/all-posts']); // Make sure this route exists in your app.routes.ts
  }
}
