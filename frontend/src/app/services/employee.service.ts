import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:3000/api/employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<any> {
    return this.http.get(this.apiUrl, { responseType: 'json' });
  }

  addEmployee(employee: any): Observable<any> {
    return this.http.post(this.apiUrl, employee);
  }

  editEmployee(id: number, updatedEmployee: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatedEmployee);
  }

  deleteEmployee(id: string): Observable<any> {
    console.log('Deleting employee with ID:', id);  // Log to check if the ID is correct

    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  updateEligibility(id: string, eligibleForReview: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { eligibleForReview });
  }
    // Fetch a single employee by ID
    getEmployeeById(id: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/${id}`);
    }
    addReview(id: string, review: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/${id}/add-review`, review);
    }
    
    
    
}
