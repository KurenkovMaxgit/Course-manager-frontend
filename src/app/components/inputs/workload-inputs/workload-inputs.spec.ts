import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkloadInputs } from './workload-inputs';

describe('WorkloadInputs', () => {
  let component: WorkloadInputs;
  let fixture: ComponentFixture<WorkloadInputs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkloadInputs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkloadInputs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
