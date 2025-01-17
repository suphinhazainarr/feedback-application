import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-manage-reviews',
  templateUrl: './manage-reviews.component.html',
  styleUrls: ['./manage-reviews.component.css'],
  standalone: false
})
export class ManageReviewsComponent implements OnInit {
  employees: any[] = [];
  editingReview: { employeeId: number; reviewId: number } | null = null;
  editedReviewText: string = '';

  constructor(private reviewService: ReviewService) {}

  ngOnInit() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.reviewService.getEmployees().subscribe(
      (data: any[]) => {
        this.employees = data;
      },
      (error: any) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  addReview(employeeId: number) {
    const reviewText = prompt('Enter your review:');
    if (reviewText) {
      const newReview = { reviewer: 'Anonymous', comment: reviewText }; // Match Mongoose Schema
      this.reviewService.addReview(employeeId, newReview).subscribe(() => {
        this.fetchEmployees();
      });
    }
  }

  editReview(employeeId: number, reviewId: number, currentText: string) {
    this.editingReview = { employeeId, reviewId };
    this.editedReviewText = currentText;
  }

  saveReview(employeeId: number, reviewId: number) {
    if (!this.editedReviewText.trim()) return;
    
    const updatedReview = { comment: this.editedReviewText }; // Match Mongoose Schema
    this.reviewService.editReview(employeeId, reviewId, updatedReview).subscribe(() => {
      this.fetchEmployees();
      this.editingReview = null;
    });
  }

  cancelEdit() {
    this.editingReview = null;
  }

  deleteReview(employeeId: number, reviewId: number) {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(employeeId, reviewId).subscribe(() => {
        this.fetchEmployees();
      });
    }
  }
}
