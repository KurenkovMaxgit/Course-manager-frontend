import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectInputs } from './subject-inputs';

describe('SubjectInputs', () => {
  let component: SubjectInputs;
  let fixture: ComponentFixture<SubjectInputs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectInputs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectInputs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
