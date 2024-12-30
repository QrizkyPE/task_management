import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskStats } from '../../models/task-stats.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule
  ]
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  taskStats: TaskStats = {
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0
  };

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTaskStats();
  }

  loadTaskStats(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.calculateStats();
    });
  }

  private calculateStats(): void {
    this.taskStats.total = this.tasks.length;
    this.taskStats.completed = this.tasks.filter(t => t.status === 'completed').length;
    this.taskStats.inProgress = this.tasks.filter(t => t.status === 'in-progress').length;
    this.taskStats.todo = this.tasks.filter(t => t.status === 'todo').length;
    this.taskStats.highPriority = this.tasks.filter(t => t.priority === 'high').length;
    this.taskStats.mediumPriority = this.tasks.filter(t => t.priority === 'medium').length;
    this.taskStats.lowPriority = this.tasks.filter(t => t.priority === 'low').length;
  }

  getCompletionPercentage(): number {
    return this.taskStats.total ? (this.taskStats.completed / this.taskStats.total) * 100 : 0;
  }
}
