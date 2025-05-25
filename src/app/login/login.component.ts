import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common'; // Import Location

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private location: Location // Inject Location
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const apiUrl = 'http://localhost:8083/api/auth/signin'; // Backend login endpoint
      this.http.post(apiUrl, this.loginForm.value).subscribe({
        next: (response: any) => {
          console.log(response); // Debug the response
          if (response.accessToken) { // Use accessToken instead of token
             localStorage.setItem('token', `Bearer ${response.accessToken}`); // Save accessToken to localStorage
            localStorage.setItem('username', response.username); // Save userName to localStorage
            localStorage.setItem('userId', response.userId); // Save userId to localStorage
            this.router.navigate(['/dashboard']).then(() => {
              this.location.replaceState('/dashboard'); // Replace login page in history
            });
          } else {
            this.errorMessage = 'Login failed: Token not received.';
          }
        },
        error: (error) => {
          this.errorMessage = error.error || 'Invalid username/email or password.';
        }
      });
    }
  }
  navigateToRegister() {
    this.router.navigate(['/register']); // Navigate to the register page
  }
}
