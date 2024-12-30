import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User, UpdateProfileData } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="profile-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Profile Settings</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <div class="form-section">
              <h3>Basic Information</h3>
              
              <mat-form-field appearance="fill">
                <mat-label>Username</mat-label>
                <input matInput formControlName="username" placeholder="Enter username">
                <mat-error *ngIf="profileForm.get('username')?.hasError('required')">
                  Username is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="fill">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email" placeholder="Enter email">
                <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
                  Please enter a valid email
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-section">
              <h3>Change Password</h3>
              
              <mat-form-field appearance="fill">
                <mat-label>Current Password</mat-label>
                <input matInput formControlName="currentPassword" type="password" 
                       placeholder="Enter current password">
              </mat-form-field>

              <mat-form-field appearance="fill">
                <mat-label>New Password</mat-label>
                <input matInput formControlName="newPassword" type="password" 
                       placeholder="Enter new password">
              </mat-form-field>

              <mat-form-field appearance="fill">
                <mat-label>Confirm New Password</mat-label>
                <input matInput formControlName="confirmPassword" type="password" 
                       placeholder="Confirm new password">
                <mat-error *ngIf="profileForm.get('confirmPassword')?.hasError('passwordMismatch')">
                  Passwords do not match
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="!profileForm.valid || loading">
                Save Changes
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }

    .form-section {
      margin-bottom: 32px;
    }

    .form-section h3 {
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 16px;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 24px;
    }

    mat-card-header {
      margin-bottom: 24px;
    }
  `]
})
export class ProfileComponent {
  profileForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });

    // Load current user data
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.profileForm.patchValue({
        username: currentUser.username,
        email: currentUser.email
      });
    }
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.loading = true;
      const formData = this.profileForm.value;

      // Only include password fields if a new password is being set
      const updateData: UpdateProfileData = {
        username: formData.username,
        email: formData.email
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      this.authService.updateProfile(updateData).subscribe({
        next: (response: User) => {
          this.loading = false;
          this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
          
          // Reset password fields
          this.profileForm.patchValue({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.snackBar.open(error.error.message || 'Error updating profile', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
