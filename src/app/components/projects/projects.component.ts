import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { ProjectFormDialogComponent } from './project-form-dialog/project-form-dialog.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSnackBarModule,
    MatNativeDateModule
  ],
  providers: [
    MatNativeDateModule
  ]
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  loading = false;

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  openProjectDialog(project?: Project): void {
    const dialogRef = this.dialog.open(ProjectFormDialogComponent, {
      width: '500px',
      data: project || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (project) {
          // Update existing project
          this.projectService.updateProject(project._id!, { ...project, ...result }).subscribe({
            next: () => {
              this.loadProjects();
              this.snackBar.open('Project updated successfully', 'Close', { duration: 3000 });
            },
            error: (error) => {
              console.error('Error updating project:', error);
              this.snackBar.open('Error updating project', 'Close', { duration: 3000 });
            }
          });
        } else {
          // Create new project
          this.projectService.createProject(result).subscribe({
            next: () => {
              this.loadProjects();
              this.snackBar.open('Project created successfully', 'Close', { duration: 3000 });
            },
            error: (error) => {
              console.error('Error creating project:', error);
              this.snackBar.open('Error creating project', 'Close', { duration: 3000 });
            }
          });
        }
      }
    });
  }

  deleteProject(id: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.loadProjects();
          this.snackBar.open('Project deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting project:', error);
          this.snackBar.open('Error deleting project', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'planned': '#9C27B0',
      'in-progress': '#2196F3',
      'completed': '#4CAF50',
      'on-hold': '#FF9800'
    };
    return colors[status] || '#757575';
  }

  private loadProjects(): void {
    this.loading = true;
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
        this.snackBar.open('Error loading projects', 'Close', { duration: 3000 });
      }
    });
  }
}
