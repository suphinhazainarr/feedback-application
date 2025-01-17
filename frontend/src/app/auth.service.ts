import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private user: any = null;

  constructor(private http: HttpClient) {}

  // Signup method
  signup(data: any): Observable<any> {
    console.log("service signup data", data);
    return this.http.post(`${this.apiUrl}/signup`, data).pipe(
      tap((response) => {
        // Perform side-effects if needed
        console.log('Signup successful:', response);
      }),
      catchError((error) => {
        console.error('Error during signup:', error);
        throw error;  // Rethrow or return an observable of an empty response
      })
    );
  }
  

  // Login method
  login(data: any): Observable<any> {
    console.log("service login data", data);
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((response) => {
        // Optionally handle the response and perform actions like setting the user
        console.log('Login successful:', response);
      }),
      catchError((error) => {
        console.error('Error during login:', error);
        throw error; // Handle the error (could be a user-friendly message)
      })
    );
  }

  // Set logged in user
  setLoggedInUser(user: any): void {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('employeeId', JSON.stringify(user.id))
  }

  // Get logged in user
  getLoggedInUser(): any {
    if (!this.user) {
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
    }
    return this.user;
  }

  // Logout the user
  logout(): void {
    this.user = null;
    localStorage.removeItem('user');
  }
}
