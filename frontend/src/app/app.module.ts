import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageEmployeesComponent } from './admin-dashboard/manage-employees/manage-employees.component';
import { ManageReviewsComponent } from './admin-dashboard/manage-reviews/manage-reviews.component';
import { AssignParticipantsComponent } from './admin-dashboard/assign-participants/assign-participants.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { AssignedReviewsComponent } from './employee-dashboard/assigned-reviews/assigned-reviews.component';
import { FeedbackSubmissionComponent } from './employee-dashboard/feedback-submission/feedback-submission.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    ManageEmployeesComponent,
    ManageReviewsComponent,
    AssignParticipantsComponent,
    EmployeeDashboardComponent,
    AssignedReviewsComponent,
    FeedbackSubmissionComponent,
    SignupComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule ,
    ReactiveFormsModule ,
    RouterModule  // <-- Add RouterModule here
    // Add this

  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()) // Enables the fetch API

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
