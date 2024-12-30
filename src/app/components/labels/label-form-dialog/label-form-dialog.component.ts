import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Label } from '../../../services/label.service';

@Component({
  selector: 'app-label-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Label' : 'Create Label' }}</h2>
    <form [formGroup]="labelForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter label name">
          <mat-error *ngIf="labelForm.get('name')?.hasError('required')">
            Name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Color</mat-label>
          <input matInput formControlName="color" type="color">
          <mat-error *ngIf="labelForm.get('color')?.hasError('required')">
            Color is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Description</mat-label>
          <textarea 
            matInput 
            formControlName="description" 
            placeholder="Enter label description"
            rows="3">
          </textarea>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close type="button">Cancel</button>
        <button 
          mat-raised-button 
          color="primary" 
          type="submit"
          [disabled]="!labelForm.valid">
          {{ data ? 'Update' : 'Create' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-dialog-content {
      min-width: 300px;
      padding-top: 16px;
    }

    input[type="color"] {
      height: 30px;
      padding: 0;
      cursor: pointer;
    }

    textarea {
      resize: vertical;
    }
  `]
})
export class LabelFormDialogComponent {
  labelForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LabelFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Label | null
  ) {
    this.labelForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      color: [data?.color || '#757575', Validators.required],
      description: [data?.description || '']
    });
  }

  onSubmit(): void {
    if (this.labelForm.valid) {
      this.dialogRef.close(this.labelForm.value);
    }
  }
} 