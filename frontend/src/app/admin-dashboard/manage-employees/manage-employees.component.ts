import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-manage-employees',
  templateUrl: './manage-employees.component.html',
  styleUrls: ['./manage-employees.component.css'],
  standalone: false,
})
export class ManageEmployeesComponent {
  employees: any[] = [];
  newEmployee = { name: '', position: '', role: 'employee', eligibleForReviewing: true };  // Added eligibleForReviewing field
  editingEmployeeId: number | null = null; // Track which employee is being edited
  editedName: string = '';
  editedPosition: string = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  

  getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (data: any[]) => {
        this.employees = data;
        console.log('Employees:', this.employees); // Log to verify the structure of the employee objects
      },
      (error: any) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  addEmployee(): void {
    if (this.newEmployee.name && this.newEmployee.position) {  // Check if name and position are filled
      this.employeeService.addEmployee(this.newEmployee).subscribe(
        (data: any) => {
          this.employees.push(data);  // Add the new employee to the list
          this.newEmployee = { name: '', position: '', role: 'employee', eligibleForReviewing: true };  // Clear the form
        },
        (error: any) => {
          console.error('Error adding employee:', error);
        }
      );
    } else {
      console.log('Please fill all the fields.');
    }
  }

  editEmployee(employee: any): void {
    this.editingEmployeeId = employee._id;
    this.editedName = employee.name;
    this.editedPosition = employee.position;
  }

  saveEmployee(id: number): void {
    const updatedEmployee = { name: this.editedName, position: this.editedPosition };

    this.employeeService.editEmployee(id, updatedEmployee).subscribe(
      (data: any) => {
        const index = this.employees.findIndex(emp => emp._id === id);
        if (index !== -1) {
          this.employees[index] = data;
        }
        this.editingEmployeeId = null; // Exit editing mode
      },
      (error: any) => {
        console.error('Error updating employee:', error);
      }
    );
  }

  cancelEdit(): void {
    this.editingEmployeeId = null; // Exit editing mode
  }

  deleteEmployee(id: string): void {
    console.log('Deleting employee with ID:', id);  // Log the ID to check if it's correct
    this.employeeService.deleteEmployee(id).subscribe(
      () => {
        this.employees = this.employees.filter(emp => emp._id !== id);
      },
      (error: any) => {
        console.error('Error deleting employee:', error);
      }
    );
  }
}
