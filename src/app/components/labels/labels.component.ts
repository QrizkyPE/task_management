import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LabelService } from '../../services/label.service';
import { LabelFormDialogComponent } from './label-form-dialog/label-form-dialog.component';

interface Label {
  _id?: string;
  name: string;
  color: string;
  description?: string;
}

@Component({
  selector: 'app-labels',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule
  ],
  template: `
    <div class="labels-container">
      <div class="header">
        <h2>Labels</h2>
        <button mat-raised-button color="primary" (click)="openLabelDialog()">
          <mat-icon>add</mat-icon>
          Create Label
        </button>
      </div>

      <div class="labels-grid">
        <mat-card *ngFor="let label of labels" class="label-card">
          <div class="label-color-bar" [style.background-color]="label.color"></div>
          <mat-card-content>
            <div class="label-header">
              <h3>{{ label.name }}</h3>
              <div class="label-actions">
                <button 
                  mat-icon-button 
                  matTooltip="Edit Label"
                  (click)="openLabelDialog(label)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button 
                  mat-icon-button 
                  matTooltip="Delete Label"
                  (click)="deleteLabel(label._id!)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
            <p class="label-description" *ngIf="label.description">
              {{ label.description }}
            </p>
            <div class="color-preview" [style.background-color]="label.color">
              {{ label.color }}
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .labels-container {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
    }

    .labels-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .label-card {
      position: relative;
      overflow: hidden;
    }

    .label-color-bar {
      height: 4px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    .label-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 8px;
    }

    .label-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
    }

    .label-actions {
      display: flex;
      gap: 8px;
    }

    .label-description {
      margin: 8px 0;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }

    .color-preview {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      color: white;
      margin-top: 8px;
    }

    mat-icon-button {
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    mat-icon-button:hover {
      opacity: 1;
    }
  `]
})
export class LabelsComponent implements OnInit {
  labels: Label[] = [];

  constructor(
    private labelService: LabelService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadLabels();
  }

  loadLabels(): void {
    this.labelService.getLabels().subscribe({
      next: (labels) => {
        this.labels = labels;
      },
      error: (error) => {
        console.error('Error loading labels:', error);
        this.snackBar.open('Error loading labels', 'Close', { duration: 3000 });
      }
    });
  }

  openLabelDialog(label?: Label): void {
    const dialogRef = this.dialog.open(LabelFormDialogComponent, {
      width: '400px',
      data: label || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (label) {
          this.updateLabel(label._id!, result);
        } else {
          this.createLabel(result);
        }
      }
    });
  }

  createLabel(labelData: Label): void {
    this.labelService.createLabel(labelData).subscribe({
      next: (newLabel) => {
        this.labels.push(newLabel);
        this.snackBar.open('Label created successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error creating label:', error);
        this.snackBar.open('Error creating label', 'Close', { duration: 3000 });
      }
    });
  }

  updateLabel(id: string, labelData: Label): void {
    this.labelService.updateLabel(id, labelData).subscribe({
      next: (updatedLabel) => {
        this.labels = this.labels.map(label => 
          label._id === id ? updatedLabel : label
        );
        this.snackBar.open('Label updated successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error updating label:', error);
        this.snackBar.open('Error updating label', 'Close', { duration: 3000 });
      }
    });
  }

  deleteLabel(id: string): void {
    if (confirm('Are you sure you want to delete this label?')) {
      this.labelService.deleteLabel(id).subscribe({
        next: () => {
          this.labels = this.labels.filter(label => label._id !== id);
          this.snackBar.open('Label deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting label:', error);
          this.snackBar.open('Error deleting label', 'Close', { duration: 3000 });
        }
      });
    }
  }
} 