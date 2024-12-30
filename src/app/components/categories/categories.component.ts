import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { CategoryFormDialogComponent } from './category-form-dialog/category-form-dialog.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  displayedColumns: string[] = ['name', 'description', 'actions'];
  loading = false;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  openCategoryDialog(category?: Category): void {
    const dialogRef = this.dialog.open(CategoryFormDialogComponent, {
      width: '400px',
      data: category || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (category) {
          // Update existing category
          this.categoryService.updateCategory(category._id!, { ...category, ...result }).subscribe({
            next: () => {
              this.loadCategories();
              this.snackBar.open('Category updated successfully', 'Close', { duration: 3000 });
            },
            error: (error) => {
              console.error('Error updating category:', error);
              this.snackBar.open('Error updating category', 'Close', { duration: 3000 });
            }
          });
        } else {
          // Create new category
          this.categoryService.createCategory(result).subscribe({
            next: () => {
              this.loadCategories();
              this.snackBar.open('Category created successfully', 'Close', { duration: 3000 });
            },
            error: (error) => {
              console.error('Error creating category:', error);
              this.snackBar.open('Error creating category', 'Close', { duration: 3000 });
            }
          });
        }
      }
    });
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
          this.snackBar.open('Category deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.snackBar.open('Error deleting category', 'Close', { duration: 3000 });
        }
      });
    }
  }

  private loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
        this.snackBar.open('Error loading categories', 'Close', { duration: 3000 });
      }
    });
  }
}
