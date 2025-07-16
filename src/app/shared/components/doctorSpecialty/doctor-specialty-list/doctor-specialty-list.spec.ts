import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorSpecialtyList } from './doctor-specialty-list';

describe('DoctorSpecialtyList', () => {
  let component: DoctorSpecialtyList;
  let fixture: ComponentFixture<DoctorSpecialtyList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorSpecialtyList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorSpecialtyList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
