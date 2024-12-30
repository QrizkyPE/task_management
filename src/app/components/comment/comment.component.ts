import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface Comment {
  _id: string;
  content: string;
  user: string;
  username: string;
  createdAt: Date;
}

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
  @Input() taskId!: string;
  @Input() comments: any[] = [];
  @Input() currentUserId!: string;
  @Output() commentAdded = new EventEmitter<string>();
  @Output() commentDeleted = new EventEmitter<string>();

  newComment: string = '';

  onSubmit() {
    console.log('Comment component - submitting:', {
      taskId: this.taskId,
      commentText: this.newComment,
      currentUserId: this.currentUserId
    });

    if (this.newComment.trim()) {
      this.commentAdded.emit(this.newComment);
      this.newComment = '';
    }
  }

  deleteComment(commentId: string): void {
    this.commentDeleted.emit(commentId);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  canDelete(comment: Comment): boolean {
    return comment.user === this.currentUserId;
  }
} 