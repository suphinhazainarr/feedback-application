import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'http://localhost:3000/api/employees';

  constructor(private http: HttpClient) {}

  // Fetch all employees with their reviews
  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  addReview(employeeId: number, review: { reviewer: string; comment: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${employeeId}/reviews`, review);
  }

  editReview(employeeId: number, reviewId: number, updatedReview: { comment: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${employeeId}/reviews/${reviewId}`, updatedReview);
  }

  deleteReview(employeeId: number, reviewId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${employeeId}/reviews/${reviewId}`);
  }

}
