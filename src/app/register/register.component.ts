import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, // For form handling
    HttpClientModule,    // For HTTP requests
    CommonModule         // For *ngIf and other directives
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const apiUrl = 'http://localhost:8083/api/auth/createUser'; // Update with your backend URL
      this.http.post(apiUrl, this.registerForm.value).subscribe({
        next: (response) => {
          this.successMessage = 'Registration successful!';
          this.errorMessage = '';
          this.registerForm.reset();
        },
        error: (error) => {
          this.successMessage = '';
          this.errorMessage = error.error || 'An error occurred during registration.';
        }
      });
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']); // Navigate to the login page
  }
}