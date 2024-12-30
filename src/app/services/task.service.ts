import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, switchMap, forkJoin, of, map } from 'rxjs';
import { Task } from '../models/task.model';
import { LabelService } from '../services/label.service';
import { Label } from '../services/label.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/api/tasks`;

  constructor(
    private http: HttpClient,
    private labelService: LabelService
  ) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      switchMap(tasks => {
        const tasksWithLabels = tasks.map(task => {
          if (!task.labels?.length) return of(task);
          
          return forkJoin(
            task.labels.map(labelId => 
              typeof labelId === 'string' ? this.labelService.getLabel(labelId) : of(labelId)
            )
          ).pipe(
            map(labels => ({
              ...task,
              labels
            }))
          );
        });

        return forkJoin(tasksWithLabels);
      }),
      // tap(tasks => console.log('Tasks with populated labels:', tasks))
    );
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`).pipe(
      tap(task => console.log('Single task data:', task))
    );
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap(newTask => console.log('Created task:', newTask))
    );
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    console.log('Updating task with data:', task);
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task).pipe(
      tap(updatedTask => {
        console.log('Updated task response:', updatedTask);
        // Ensure labels are populated in the response
        if (updatedTask.labels) {
          updatedTask.labels = updatedTask.labels.map(labelId => {
            if (typeof labelId === 'string') {
              this.labelService.getLabel(labelId).subscribe((label: Label) => {
                const labels = updatedTask.labels || [];
                const index = labels.indexOf(labelId);
                if (index !== -1) {
                  labels[index] = label;
                }
              });
            }
            return labelId;
          });
        }
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addComment(taskId: string, commentText: string): Observable<Task> {
    console.log('TaskService - Adding comment:', {
      taskId,
      text: commentText,
      url: `${this.apiUrl}/${taskId}/comments`
    });
    
    return this.http.post<Task>(
      `${this.apiUrl}/${taskId}/comments`,
      { text: commentText }
    ).pipe(
      tap(response => console.log('Server response:', response))
    );
  }

  deleteComment(taskId: string, commentId: string): Observable<Task> {
    return this.http.delete<Task>(`${this.apiUrl}/${taskId}/comments/${commentId}`);
  }
}
