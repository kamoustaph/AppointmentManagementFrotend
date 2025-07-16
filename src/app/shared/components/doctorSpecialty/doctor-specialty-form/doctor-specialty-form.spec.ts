import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorSpecialtyForm } from './doctor-specialty-form';

describe('DoctorSpecialtyForm', () => {
  let component: DoctorSpecialtyForm;
  let fixture: ComponentFixture<DoctorSpecialtyForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorSpecialtyForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorSpecialtyForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
