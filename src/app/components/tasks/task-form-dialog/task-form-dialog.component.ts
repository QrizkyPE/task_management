import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { CategoryService } from '../../../services/category.service';
import { Task } from '../../../models/task.model';
import { Category } from '../../../models/category.model';
import { MatChipsModule } from '@angular/material/chips';
import { LabelService } from '../../../services/label.service';
import { Label } from '../../../services/label.service';

@Component({
  selector: 'app-task-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule
  ],
  providers: [
    MatDatepickerModule,
    provideNativeDateAdapter()
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Task' : 'Create Task' }}</h2>
    <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="fill">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description"></textarea>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Category</mat-label>
          <mat-select formControlName="categoryId">
            <mat-option [value]="null">No Category</mat-option>
            <mat-option *ngFor="let category of categories" [value]="category._id">
              {{ category.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Priority</mat-label>
          <mat-select formControlName="priority" required>
            <mat-option value="low">Low</mat-option>
            <mat-option value="medium">Medium</mat-option>
            <mat-option value="high">High</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status" required>
            <mat-option value="todo">To Do</mat-option>
            <mat-option value="in-progress">In Progress</mat-option>
            <mat-option value="completed">Completed</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Labels</mat-label>
          <mat-select formControlName="labels" multiple>
            <mat-option *ngFor="let label of labels" [value]="label._id">
              <span class="label-option">
                <span class="color-dot" [style.background-color]="label.color"></span>
                {{ label.name }}
              </span>
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Due Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dueDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!taskForm.valid">
          {{ data ? 'Update' : 'Create' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-dialog-content {
      min-width: 300px;
    }
    .label-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .color-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
    }
  `]
})
export class TaskFormDialogComponent implements OnInit {
  priorityOptions = ['low', 'medium', 'high'];
  statusOptions = ['todo', 'in-progress', 'completed'];
  categories: Category[] = [];
  taskForm: FormGroup;
  labels: Label[] = [];
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task | null,
    private categoryService: CategoryService,
    private labelService: LabelService
  ) {
    this.taskForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      description: [data?.description || ''],
      priority: [data?.priority || 'medium', Validators.required],
      status: [data?.status || 'todo', Validators.required],
      dueDate: [data?.dueDate ? new Date(data.dueDate) : null],
      categoryId: [data?.categoryId || null],
      labels: [data?.labels?.map(l => l._id) || []]
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadLabels();
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      console.log('Form values before submission:', formValue);
      
      const selectedLabels = formValue.labels.map((labelId: string) => 
        this.labels.find(l => l._id === labelId)
      ).filter(Boolean);
      
      const taskData = {
        ...formValue,
        labels: selectedLabels
      };
      
      console.log('Task data being sent:', taskData);
      this.dialogRef.close(taskData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Available categories:', categories);
      },
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  loadLabels() {
    this.labelService.getLabels().subscribe(labels => {
      this.labels = labels;
      console.log('Available labels:', labels);
    });
  }
} 