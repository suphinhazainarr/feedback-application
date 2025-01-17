import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-feedback-submission',
  standalone: false,
  
  templateUrl: './feedback-submission.component.html',
  styleUrl: './feedback-submission.component.css'
})
export class FeedbackSubmissionComponent implements OnInit {
  reviewForm: FormGroup;
  employees: any[] = []; // To hold the list of employees
  loggedInEmployeeId: string | null = '';
  isEligible: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.reviewForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    // Get the full user object from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  
    if (loggedInUser && loggedInUser.id) {
      this.loggedInEmployeeId = loggedInUser.id;
      // Check if employee data exists and if eligibleForReview is available
      this.isEligible = loggedInUser.eligibleForReview;
    } else {
      console.error('No user data found in localStorage');
    }

    // Fetch employees that the logged-in user needs to review
    this.employeeService.getEmployees().subscribe((response: any) => {
      this.employees = response.filter((employee: { eligibleForReview: any; }) => !employee.eligibleForReview);  // Filter for employees who are not yet reviewed
    });
  }
  submitReview(employee: any): void {
    if (!this.isEligible) {
      alert('You are not eligible to submit a review.');
      return;
    }

    if (this.reviewForm.valid) {
      const review = {
        reviewer: this.loggedInEmployeeId,
        comment: this.reviewForm.value.comment
      };

      this.employeeService.addReview(employee._id, review).subscribe(response => {
        alert('Review submitted successfully!');
        this.router.navigate(['/employee/assigned-reviews']); // Redirect to the reviews page
      }, (error: any) => {
        console.error('Error submitting review:', error);
      });
    }
  }
}
