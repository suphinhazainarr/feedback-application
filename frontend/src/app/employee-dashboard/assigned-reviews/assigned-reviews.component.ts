import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
interface Employee {
  _id: string;
  name: string;
  position: string;
  reviews: Review[];
}
interface Review {
  reviewer: string;
  comment: string; // Change 'feedback' to 'comment' to match API response
  _id: string;
}

@Component({
  selector: 'app-assigned-reviews',
  standalone: false,
  
  templateUrl: './assigned-reviews.component.html',
  styleUrl: './assigned-reviews.component.css'
})
export class AssignedReviewsComponent {
  employees: Employee[] = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (data: Employee[]) => {
        this.employees = data;
        console.log("Fetched Employees:", JSON.stringify(this.employees, null, 2));
      },
      (error: any) => {
        console.error('Error fetching employees:', error);
      }
    );
  }
}
