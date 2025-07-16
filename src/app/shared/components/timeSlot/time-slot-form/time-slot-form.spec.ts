import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSlotForm } from './time-slot-form';

describe('TimeSlotForm', () => {
  let component: TimeSlotForm;
  let fixture: ComponentFixture<TimeSlotForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeSlotForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeSlotForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
