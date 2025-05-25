import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Post } from '../profile/Post';
import { User } from '../profile/User';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-manage-post',
  templateUrl: './manage-post.component.html',
  styleUrls: ['./manage-post.component.scss'],
  standalone: true, // Ensure this is a standalone component
  imports: [CommonModule, HttpClientModule] // Add CommonModule here
})
export class ManagePostComponent {
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

          // Fetch posts after user details are loaded
          this.fetchUserPosts();
        },
        error: (error) => {
          if (error.status === 404) {
            console.error('User not found');
          } else {
            console.error('Failed to load the user');
          }
          this.loading = false;
        }
      });
    } else {
      console.error('No username found in route parameters');
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

    if (!userId || userId === 'undefined') {
      console.error('Invalid userId. Cannot fetch posts.');
      this.postsLoading = false;
      return;
    }

    this.http_client.get<Post[]>(`http://localhost:8083/api/posts/${userId}`).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.postsLoading = false;
      },
      error: (error) => {
        console.error('Failed to load posts', error);
        this.postsLoading = false;
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  editPost(postId: string) {
    this.router.navigate([`/edit-post/${postId}`]);
  }

  deletePost(postId: string) {
    // Call the API to delete the post
    this.http_client.delete(`http://localhost:8083/api/posts/delete/${postId}`, { responseType: 'text' }).subscribe({
      next: (response) => {
        // Remove the post from the list after successful deletion
        this.posts = this.posts.filter(post => post.id !== postId);
        console.log(`Post with ID: ${postId} deleted successfully. Response: ${response}`);
      },
      error: (err) => {
        console.error(`Failed to delete post with ID: ${postId}`, err);
      }
    });
  }
}
