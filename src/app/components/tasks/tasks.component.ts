import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';
import { TaskFormDialogComponent } from './task-form-dialog/task-form-dialog.component';
import { forkJoin } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { TaskDetailsComponent } from './task-details/task-details.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule
  ],
  template: `
    <div class="tasks-container">
      <button mat-raised-button color="primary" (click)="openTaskDialog()">
        <mat-icon>add</mat-icon>
        Create Task
      </button>

      <div class="categories-grid">
        <!-- Show all categories including uncategorized -->
        <div *ngFor="let category of categories" class="category-section">
          <h2>{{ category.name || 'Uncategorized' }}</h2>
          <div class="tasks-grid">
            <mat-card *ngFor="let task of getTasksByCategory(category._id)" class="task-card">
              <mat-card-header>
                <mat-card-title>{{ task.title }}</mat-card-title>
                <mat-card-subtitle>
                  <mat-chip-set>
                    <mat-chip [ngClass]="'priority-' + task.priority.toLowerCase()">
                      {{ task.priority }}
                    </mat-chip>
                    <mat-chip [ngClass]="'status-' + task.status.toLowerCase()">
                      {{ task.status }}
                    </mat-chip>
                  </mat-chip-set>
                </mat-card-subtitle>
              </mat-card-header>

              <mat-card-content>
                <p *ngIf="task.description">{{ task.description }}</p>
                
                <!-- Labels section -->
                <div class="task-labels" *ngIf="task.labels?.length">
                  <mat-chip-set>
                    <mat-chip *ngFor="let label of task.labels" 
                              [style.background-color]="getLabelColor(label)"
                              [style.color]="'white !important'">
                      {{ getLabelName(label) }}
                    </mat-chip>
                  </mat-chip-set>
                </div>

                <div class="task-meta">
                  <span *ngIf="task.dueDate" class="due-date">
                    <mat-icon>event</mat-icon>
                    {{ task.dueDate | date }}
                  </span>
                </div>
              </mat-card-content>

              <mat-card-actions align="end" class="task-actions">
                <button mat-icon-button (click)="viewTaskDetails(task)">
                  <mat-icon>comment</mat-icon>
                </button>
                <button mat-icon-button (click)="editTask(task)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button (click)="deleteTask(task._id!)">
                  <mat-icon>delete</mat-icon>
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </div>

        <!-- Uncategorized tasks -->
        <div class="category-section">
          <h2>Uncategorized</h2>
          <div class="tasks-grid">
            <mat-card *ngFor="let task of getTasksByCategory(null)" class="task-card">
              <mat-card-header>
                <mat-card-title>{{ task.title }}</mat-card-title>
                <mat-card-subtitle>
                  <mat-chip-set>
                    <mat-chip [ngClass]="'priority-' + task.priority.toLowerCase()">
                      {{ task.priority }}
                    </mat-chip>
                    <mat-chip [ngClass]="'status-' + task.status.toLowerCase()">
                      {{ task.status }}
                    </mat-chip>
                  </mat-chip-set>
                </mat-card-subtitle>
              </mat-card-header>

              <mat-card-content>
                <p *ngIf="task.description">{{ task.description }}</p>
                
                <!-- Labels section -->
                <div class="task-labels" *ngIf="task.labels?.length">
                  <mat-chip-set>
                    <mat-chip *ngFor="let label of task.labels" 
                              [style.background-color]="getLabelColor(label)"
                              [style.color]="'white !important'">
                      {{ getLabelName(label) }}
                    </mat-chip>
                  </mat-chip-set>
                </div>

                <div class="task-meta">
                  <span *ngIf="task.dueDate" class="due-date">
                    <mat-icon>event</mat-icon>
                    {{ task.dueDate | date }}
                  </span>
                </div>
              </mat-card-content>

              <mat-card-actions align="end" class="task-actions">
                <button mat-icon-button (click)="viewTaskDetails(task)">
                  <mat-icon>comment</mat-icon>
                </button>
                <button mat-icon-button (click)="editTask(task)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button (click)="deleteTask(task._id!)">
                  <mat-icon>delete</mat-icon>
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tasks-container {
      padding: 20px;
    }
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .category-section {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 16px;
    }
    .tasks-grid {
      display: grid;
      gap: 16px;
      margin-top: 16px;
    }
    .task-card {
      margin-bottom: 16px;
      position: relative;
    }
    .task-card mat-card-content {
      margin-bottom: 40px;
    }
    .task-actions {
      position: absolute;
      bottom: 8px;
      right: 8px;
      padding: 0;
      margin: 0;
    }
    .task-labels {
      margin: 8px 0;
    }
    mat-chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    mat-chip {
      font-size: 12px;
      height: 24px;
      padding: 0 8px;
    }
    .task-meta {
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 16px;
      color: rgba(0, 0, 0, 0.6);
      font-size: 12px;
    }
    .task-meta .mat-icon {
      font-size: 16px;
      height: 16px;
      width: 16px;
      margin-right: 4px;
      vertical-align: middle;
    }
    .priority-high {
      background-color: #f44336 !important;
      color: white !important;
    }
    .priority-medium {
      background-color: #ff9800 !important;
      color: white !important;
    }
    .priority-low {
      background-color: #4caf50 !important;
      color: white !important;
    }
    .status-planned {
      background-color: #9c27b0 !important;
      color: white !important;
    }
    .status-in-progress {
      background-color: #2196f3 !important;
      color: white !important;
    }
    .status-completed {
      background-color: #4caf50 !important;
      color: white !important;
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
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  categories: Category[] = [];

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Load both tasks and categories simultaneously
    forkJoin({
      tasks: this.taskService.getTasks(),
      categories: this.categoryService.getCategories()
    }).subscribe({
      next: (data) => {
        this.tasks = data.tasks;
        this.categories = data.categories;
        // Add debug logging
        console.log('Loaded tasks:', this.tasks);
        this.tasks.forEach(task => {
          if (task.labels?.length) {
            console.log(`Task ${task.title} labels:`, task.labels);
          }
        });
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.snackBar.open('Error loading data', 'Close', { duration: 3000 });
      }
    });
  }

  getTasksByCategory(categoryId: string | null | undefined): Task[] {
    return this.tasks.filter(task => 
      categoryId === null || categoryId === undefined 
        ? !task.categoryId 
        : task.categoryId === categoryId
    );
  }

  createTask(taskData: Partial<Task>) {
    console.log('Creating task with data:', taskData);
    this.taskService.createTask(taskData as Task).subscribe({
      next: (createdTask: Task) => {
        console.log('Created task:', createdTask);
        this.tasks = [...this.tasks, createdTask];
        this.snackBar.open('Task created successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this.snackBar.open('Error creating task', 'Close', { duration: 3000 });
      }
    });
  }

  openTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createTask(result);
      }
    });
  }

  editTask(task: Task) {
    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '500px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.updateTask(task._id!, result).subscribe({
          next: (updatedTask) => {
            this.tasks = this.tasks.map(t => 
              t._id === updatedTask._id ? updatedTask : t
            );
            this.snackBar.open('Task updated successfully', 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error updating task:', error);
            this.snackBar.open('Error updating task', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteTask(taskId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Delete Task', message: 'Are you sure you want to delete this task?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(taskId).subscribe({
          next: () => {
            this.tasks = this.tasks.filter(task => task._id !== taskId);
            this.snackBar.open('Task deleted successfully', 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error deleting task:', error);
            this.snackBar.open('Error deleting task', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  viewTaskDetails(task: Task) {
    const dialogRef = this.dialog.open(TaskDetailsComponent, {
      width: '600px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      // Refresh tasks if needed
      this.loadData();
    });
  }

  getLabelColor(label: any): string {
    if (!label) return '#757575';
    
    if (typeof label === 'string') {
      // If we only have the ID, try to fetch the full label data
      // console.warn('Label is just an ID:', label);
      return '#757575';
    }
    
    // console.log('Label with color:', label);
    return label.color || '#757575';
  }

  getContrastColor(hexcolor: string): string {
    if (!hexcolor || hexcolor === '#757575') {
      return '#FFFFFF';
    }
    
    try {
      const hex = hexcolor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? '#000000' : '#FFFFFF';
    } catch (error) {
      console.warn('Error calculating contrast color:', error);
      return '#FFFFFF';
    }
  }

  getLabelName(label: any): string {
    if (!label) return '';
    return typeof label === 'string' ? 'Loading...' : label.name;
  }
}
