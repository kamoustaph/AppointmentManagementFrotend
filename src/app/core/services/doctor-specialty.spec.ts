import { TestBed } from '@angular/core/testing';

import { DoctorSpecialty } from './doctor-specialty';

describe('DoctorSpecialty', () => {
  let service: DoctorSpecialty;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorSpecialty);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
