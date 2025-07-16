import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialtyList } from './specialty-list';

describe('SpecialtyList', () => {
  let component: SpecialtyList;
  let fixture: ComponentFixture<SpecialtyList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialtyList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialtyList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
