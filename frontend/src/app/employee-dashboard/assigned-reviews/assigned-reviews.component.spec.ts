import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedReviewsComponent } from './assigned-reviews.component';

describe('AssignedReviewsComponent', () => {
  let component: AssignedReviewsComponent;
  let fixture: ComponentFixture<AssignedReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignedReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
