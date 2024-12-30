import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Task } from '../../../models/task.model';
import { CommentComponent } from '../../comment/comment.component';
import { AuthService } from '../../../services/auth.service';
import { TaskService } from '../../../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    CommentComponent,
    MatChipsModule
  ],
  template: `
    <div class="task-details-dialog">
      <h2 mat-dialog-title>{{ task.title }}</h2>
      
      <mat-dialog-content>
        <div class="task-details">
          <div class="detail-item">
            <span class="label">Description:</span>
            <span class="value">{{ task.description || 'No description' }}</span>
          </div>
          
          <div class="detail-item">
            <span class="label">Priority:</span>
            <span class="value" [class]="'priority-' + task.priority">
              {{ task.priority }}
            </span>
          </div>
          
          <div class="detail-item">
            <span class="label">Status:</span>
            <span class="value" [class]="'status-' + task.status">
              {{ task.status }}
            </span>
          </div>

          <div class="detail-item">
            <span class="label">Labels:</span>
            <span class="value">
              <mat-chip-set *ngIf="task.labels?.length">
                <mat-chip *ngFor="let label of task.labels"
                         [style.background-color]="label.color"
                         style="color: white !important">
                  {{ label.name }}
                </mat-chip>
              </mat-chip-set>
              <span *ngIf="!task.labels?.length">No labels</span>
            </span>
          </div>
          
          <div class="detail-item" *ngIf="task.dueDate">
            <span class="label">Due Date:</span>
            <span class="value">{{ task.dueDate | date:'medium' }}</span>
          </div>
        </div>

        <div class="comments-section">
          <app-comment
            [taskId]="task._id!"
            [comments]="task.comments || []"
            [currentUserId]="currentUserId"
            (commentAdded)="onCommentAdded($event)"
            (commentDeleted)="deleteComment($event)">
          </app-comment>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button 
          mat-button 
          mat-dialog-close 
          class="close-button">
          Close
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .task-details-dialog {
      padding: 0;
      max-width: 600px;
      width: 100%;
    }

    mat-dialog-title {
      margin: 0;
      padding: 16px 24px;
      background: #f5f5f5;
      font-size: 20px;
      font-weight: 500;
    }

    mat-dialog-content {
      margin: 0;
      padding: 24px;
      max-height: 70vh;
    }

    .task-details {
      background: #fff;
      border-radius: 4px;
      padding: 16px;
      margin-bottom: 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .detail-item {
      margin-bottom: 12px;
      display: flex;
      align-items: flex-start;
    }

    .detail-item:last-child {
      margin-bottom: 0;
    }

    .label {
      font-weight: 500;
      min-width: 100px;
      color: rgba(0,0,0,0.7);
    }

    .value {
      flex: 1;
    }

    .priority-high {
      color: #f44336;
    }

    .priority-medium {
      color: #ff9800;
    }

    .priority-low {
      color: #4caf50;
    }

    .status-todo {
      color: #757575;
    }

    .status-in-progress {
      color: #2196f3;
    }

    .status-completed {
      color: #4caf50;
    }

    .comments-section {
      margin-top: 24px;
    }

    mat-dialog-actions {
      padding: 12px 24px;
      margin: 0;
      border-top: 1px solid rgba(0,0,0,0.12);
    }

    .close-button {
      min-width: 100px;
      font-weight: 500;
    }

    :host ::ng-deep .mat-mdc-dialog-container {
      padding: 0;
    }

    mat-chip-set {
      display: flex;
      gap: 8px;
    }

    mat-chip {
      min-height: 24px;
      font-size: 12px;
    }
  `]
})
export class TaskDetailsComponent {
  currentUserId: string;

  constructor(
    public dialogRef: MatDialogRef<TaskDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public task: Task,
    private authService: AuthService,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {
    this.currentUserId = this.authService.getCurrentUser()?._id || '';
  }

  onCommentAdded(commentText: string) {
    if (commentText.trim()) {
      console.log('Sending comment:', {
        taskId: this.task._id,
        text: commentText
      });
      
      this.taskService.addComment(this.task._id!, commentText).subscribe({
        next: (updatedTask) => {
          console.log('Comment added successfully:', updatedTask);
          this.task = updatedTask;
          this.snackBar.open('Comment added successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error details:', error);
          this.snackBar.open('Error adding comment', 'Close', { duration: 3000 });
        }
      });
    }
  }

  deleteComment(commentId: string): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.taskService.deleteComment(this.task._id!, commentId).subscribe({
        next: (updatedTask) => {
          this.task = updatedTask;
          this.snackBar.open('Comment deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting comment:', error);
          this.snackBar.open('Error deleting comment', 'Close', { duration: 3000 });
        }
      });
    }
  }
} 