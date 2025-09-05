import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherInputs } from './teacher-inputs';

describe('TeacherInputs', () => {
  let component: TeacherInputs;
  let fixture: ComponentFixture<TeacherInputs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherInputs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherInputs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
