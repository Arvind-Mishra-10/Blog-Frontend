import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [FormsModule, HttpClientModule], // Add HttpClientModule here
})
export class SettingsComponent {
  profile = {
    name: '',
    email: '',
    username: '', // Add username for consistency
  };

  passwords = {
    currentPassword: '',
    newPassword: '',
  };

  isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      const username = localStorage.getItem('username'); // Get the username from localStorage
      if (!username) {
        alert('Username not found in localStorage.');
        return;
      }

      // Fetch user profile data
      this.http.get(`http://localhost:8083/api/auth/${username}`).subscribe({
        next: (data: any) => {
          this.profile.name = data.name;
          this.profile.email = data.email;
          this.profile.username = data.username; // Store username for display or future use
        },
        error: (error) => {
          console.error('Error fetching profile:', error);
          alert('Failed to fetch profile. Please try again later.');
        },
      });
    }
  }

  // Update user profile
  updateProfile() {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token'); // Retrieve the JWT token

    if (!username) {
      alert('Username not found in localStorage.');
      return;
    }

    if (!token) {
      alert('Authentication token not found. Please log in again.');
      this.router.navigate(['/login']);
      return;
    }

    const userDto = {
      name: this.profile.name,
      email: this.profile.email,
    };

    const headers = { Authorization: token }; // Token already includes "Bearer"

    this.http.put(`http://localhost:8083/api/auth/update/${username}`, userDto, { headers }).subscribe({
      next: (response: any) => {
        alert('Profile updated successfully!');
        if (response.token) {
          localStorage.setItem('token', `Bearer ${response.token}`); // Store the new token
        }
        this.ngOnInit(); // Refresh profile data
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        if (error.status === 401) {
          alert('Unauthorized. Please log in again.');
          this.router.navigate(['/login']);
        } else {
          alert('Failed to update profile. Please try again later.');
        }
      },
    });
  }

  // Change user password
  changePassword() {
    const username = localStorage.getItem('username'); // Retrieve the username from localStorage
    const token = localStorage.getItem('token'); // Retrieve the JWT token

    if (!username) {
      alert('Username not found in localStorage.');
      return;
    }

    if (!token) {
      alert('Authentication token not found. Please log in again.');
      this.router.navigate(['/login']);
      return;
    }

    const headers = { Authorization: token }; // Token already includes "Bearer"

    // Ensure both oldPassword and newPassword are included in the request body
    const passwordPayload = {
      oldPassword: this.passwords.currentPassword,
      newPassword: this.passwords.newPassword,
    };

    this.http.put(`http://localhost:8083/api/auth/changePassword/${username}`, passwordPayload, { headers }).subscribe({
      next: (response: any) => {
        console.log('Response:', response); // Debug the response
        alert(response.message || 'Password changed successfully!'); // Display the success message from the backend
        this.passwords = { currentPassword: '', newPassword: '' }; // Clear the password fields
      },
      error: (error) => {
        console.error('Error changing password:', error);
        if (error.status === 400) {
          alert(error.error.message || 'Old password does not match.'); // Display the error message from the backend
        } else if (error.status === 404) {
          alert('User not found. Please log in again.');
          this.router.navigate(['/login']);
        } else {
          alert('Failed to change password. Please try again later.');
        }
      },
    });
  }

  // Delete user account
  deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
       const username = localStorage.getItem('username'); // Retrieve the username from localStorage
    const token = localStorage.getItem('token'); // Retrieve the JWT token
      this.http.delete(`/api/user/delete${username}`).subscribe({
        next: () => {
          alert('Account deleted successfully.');
          localStorage.clear();
          this.router.navigate(['/login']);
        },
        error: () => alert('Failed to delete account.'),
      });
    }
  }
}
