import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Label {
  _id?: string;
  name: string;
  color: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  private apiUrl = `${environment.apiUrl}/api/labels`;

  constructor(private http: HttpClient) {}

  getLabels(): Observable<Label[]> {
    return this.http.get<Label[]>(this.apiUrl).pipe(
      tap(labels => console.log('Fetched labels:', labels)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching labels:', error);
        throw error;
      })
    );
  }

  createLabel(label: Label): Observable<Label> {
    return this.http.post<Label>(this.apiUrl, label).pipe(
      tap(newLabel => console.log('Created label:', newLabel)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating label:', error);
        throw error;
      })
    );
  }

  updateLabel(id: string, label: Label): Observable<Label> {
    return this.http.put<Label>(`${this.apiUrl}/${id}`, label).pipe(
      tap(updatedLabel => console.log('Updated label:', updatedLabel)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating label:', error);
        throw error;
      })
    );
  }

  deleteLabel(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log('Deleted label:', id)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error deleting label:', error);
        throw error;
      })
    );
  }

  getLabel(id: string): Observable<Label> {
    return this.http.get<Label>(`${this.apiUrl}/${id}`);
  }
} 