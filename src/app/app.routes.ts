import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard'; // Import AuthGuard
import { EditPostComponent } from './edit-post/edit-post.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] }, // Protect login route
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  {
    path: 'profile/:username',
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'all-posts',
    loadComponent: () => import('./all-posts-feed/all-posts-feed.component').then(m => m.AllPostsFeedComponent)
  },
  {
    path: 'manageposts/:username',
    loadComponent: () => import('./manage-post/manage-post.component').then(m => m.ManagePostComponent)
  },
  { path: 'edit-post/:postId', component: EditPostComponent },
  { path: 'settings', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}