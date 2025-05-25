import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { User } from './User';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Post } from './Post'; // Create this interface if you don't have it
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [HttpClientModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: User = new User();
  username: any;
  loading = true;

  posts: Post[] = [];
  postsLoading = false;
  showPosts = false;

  constructor(private http_client: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username');
    if (this.username) {
      this.getUserDetails(this.username).subscribe({
        next: (response) => {
          this.user = response;
          this.loading = false;
        },
        error: (error) => {
          if (error.status === 404) {
            console.error('User not found');
          } else {
            console.error('Failed to Load the User');
          }
          this.loading = false;
        }
      });
    }
  }

  getUserDetails(username: any): Observable<User> {
    return this.http_client.get<User>(`http://localhost:8083/api/auth/${username}`);
  }

  fetchUserPosts() {
    this.postsLoading = true;
    this.showPosts = true;
    // Get userId from the loaded user object or from localStorage
    const userId = this.user.id || localStorage.getItem('id');
    this.http_client.get<Post[]>(`http://localhost:8083/api/posts/${userId}`).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.postsLoading = false;
      },
      error: (error) => {
        console.error('Failed to load posts');
        this.postsLoading = false;
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
