import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSlotList } from './time-slot-list';

describe('TimeSlotList', () => {
  let component: TimeSlotList;
  let fixture: ComponentFixture<TimeSlotList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeSlotList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeSlotList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
