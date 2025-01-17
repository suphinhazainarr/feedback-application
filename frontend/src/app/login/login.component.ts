import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,  // Inject AuthService for login logic
    private router: Router
  ) {}

  login() {
    const loginData = { name: this.username, password: this.password };
  
    this.authService.login(loginData).subscribe(
      (response: any) => {
        console.log('Login response:', response); // Check the response to see if user._id exists
  
        if (response.user) {
          // Store the token and user details (including user ID) in local storage
          this.authService.setLoggedInUser(response.user);
  
          // Save user ID to local storage
          localStorage.setItem('employeeId', response.user._id);  // Ensure this value exists
  
          // Redirect based on the role
          if (response.user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (response.user.role === 'employee') {
            this.router.navigate(['/employee']);
          }
        } else {
          this.errorMessage = 'Invalid login response';
        }
      },
      (error) => {
        this.errorMessage = 'Invalid login credentials';
      }
    );
  }
  
  
}
