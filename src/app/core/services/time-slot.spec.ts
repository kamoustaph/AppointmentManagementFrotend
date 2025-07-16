import { TestBed } from '@angular/core/testing';

import { TimeSlot } from './time-slot';

describe('TimeSlot', () => {
  let service: TimeSlot;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeSlot);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
