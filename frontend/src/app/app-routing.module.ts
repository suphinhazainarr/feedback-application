import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageEmployeesComponent } from './admin-dashboard/manage-employees/manage-employees.component';
import { ManageReviewsComponent } from './admin-dashboard/manage-reviews/manage-reviews.component';
import { AssignParticipantsComponent } from './admin-dashboard/assign-participants/assign-participants.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { AssignedReviewsComponent } from './employee-dashboard/assigned-reviews/assigned-reviews.component';
import { FeedbackSubmissionComponent } from './employee-dashboard/feedback-submission/feedback-submission.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },


  { path: 'admin', component: AdminDashboardComponent, children: [
      { path: 'manage-employees', component: ManageEmployeesComponent },
      { path: 'manage-reviews', component: ManageReviewsComponent },
      { path: 'assign-participants', component: AssignParticipantsComponent },
    ]
  },
  { path: 'employee', component: EmployeeDashboardComponent, children: [
      { path: 'assigned-reviews', component: AssignedReviewsComponent },
      { path: 'feedback-submission', component: FeedbackSubmissionComponent },
    ]
  },
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
