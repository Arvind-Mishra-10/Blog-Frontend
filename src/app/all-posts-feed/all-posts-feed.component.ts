import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Post {
  id: string;
  userId: number;
  title: string;
  description: string;
  content: string;
  username: string;
  // Add comments or other fields if needed
}

@Component({
  selector: 'app-all-posts-feed',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './all-posts-feed.component.html',
  styleUrls: ['./all-posts-feed.component.scss']
})
export class AllPostsFeedComponent implements OnInit {
  posts: Post[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8083/api/posts/All_postAndComment').subscribe({
      next: (data) => {
        this.posts = data.map(item => ({
          ...item.post,
          username: item.user.username
        }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
