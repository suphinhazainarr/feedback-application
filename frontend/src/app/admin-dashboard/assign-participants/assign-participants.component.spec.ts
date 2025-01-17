import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignParticipantsComponent } from './assign-participants.component';

describe('AssignParticipantsComponent', () => {
  let component: AssignParticipantsComponent;
  let fixture: ComponentFixture<AssignParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignParticipantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
