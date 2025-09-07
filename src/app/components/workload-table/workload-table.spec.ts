import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkloadTable } from './workload-table';

describe('WorkloadTable', () => {
  let component: WorkloadTable;
  let fixture: ComponentFixture<WorkloadTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkloadTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkloadTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
