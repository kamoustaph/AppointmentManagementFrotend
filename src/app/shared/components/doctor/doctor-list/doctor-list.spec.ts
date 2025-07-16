import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorList } from './doctor-list';

describe('DoctorList', () => {
  let component: DoctorList;
  let fixture: ComponentFixture<DoctorList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
