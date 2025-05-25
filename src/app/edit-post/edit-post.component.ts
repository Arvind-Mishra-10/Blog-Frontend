import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Post } from '../profile/Post';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
  standalone: true,
  imports: [FormsModule], // Add FormsModule here
})
export class EditPostComponent implements OnInit {
  post: Post = {
    id: '',
    title: '',
    description: '',
    content: '',
    userId: 0, // Add other necessary fields
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const username = localStorage.getItem('username'); // Get the username from localStorage
    const postId = this.route.snapshot.paramMap.get('postId');
    if (postId) {
      this.fetchPost(postId);
    }
  }

  fetchPost(postId: string) {
    this.http
      .get<Post>(`http://localhost:8083/api/posts/getPostbyPostid/${postId}`)
      .subscribe({
        next: (response) => {
          this.post = response;
          console.log('Fetched post:', this.post); // Debugging
        },
        error: (err) => {
          console.error('Failed to fetch post:', err);
        },
      });
  }

  onSubmit() {
    const username = localStorage.getItem('username'); // Get the username from localStorage
    this.http
      .put<Post>(
        `http://localhost:8083/api/posts/updatingPost/${this.post.id}`,
        this.post
      )
      .subscribe({
        next: (response) => {
          console.log('Post updated successfully:', response);
          this.router.navigate(['/manageposts', username]);
        },
        error: (err) => {
          console.error('Failed to update post:', err);
        },
      });
  }

  goBack() {
     const username = localStorage.getItem('username'); // Get the username from localStorage
  if (!username) {
    console.error('Username not found in localStorage');
    return;
  }
    this.router.navigate(['/manageposts',username]); // Navigate to posts page
  }
}
