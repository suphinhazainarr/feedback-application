import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  name = '';
  password = '';
  position = '';
  role = 'employee';

  constructor(private authService: AuthService, private router: Router) {}

  signup() {
    console.log("Before service call");
  
    this.authService.signup({ name: this.name, password: this.password, position: this.position, role: this.role }).subscribe({
      next: () => {
        alert('Signup successful');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error("Signup error:", error);
        let errorMessage = "An error occurred. Please try again.";
        
        // Log the status and error details to understand the issue better
        console.log("Error status:", error.status);
        console.log("Error response:", error.error);
  
        if (error.status === 0) {
          errorMessage = "Cannot connect to the server. Please check if the backend is running.";
        } else if (error.status === 400) {
          errorMessage = error.error?.error || "Bad request. Please check your inputs.";
        } else if (error.status === 409) {
          errorMessage = "Username already exists. Please choose a different one.";
        } else if (error.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
  
        alert(errorMessage);
      }
    });
  }
  
}
