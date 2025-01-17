import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';

interface Employee {
  _id: string;
  name: string;
  position: string;
  eligibleForReview: boolean; // Toggle eligibility
}

@Component({
  selector: 'app-assign-participants',
  standalone: false,
  templateUrl: './assign-participants.component.html',
  styleUrls: ['./assign-participants.component.css'] // Corrected to styleUrls (plural)
})
export class AssignParticipantsComponent implements OnInit {
  employees: Employee[] = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  // Get employee data from the database
  getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (data: Employee[]) => {
        this.employees = data;
        console.log('Fetched employees:', this.employees);  // Check if 'id' is present in each employee
      },
      (error: any) => {
        console.error('Error fetching employees:', error);
      }
    );
  }
  

  // Toggle the eligibility for review
  toggleEligibility(employee: Employee): void {
    const updatedEligibility = !employee.eligibleForReview;
    this.employeeService.updateEligibility(employee._id, updatedEligibility).subscribe(
      () => {
        employee.eligibleForReview = updatedEligibility;
      },
      (error: any) => {
        console.error('Error updating eligibility:', error);
      }
    );
  }
}
