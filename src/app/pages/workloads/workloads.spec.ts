import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Workloads } from './workloads';

describe('Workloads', () => {
  let component: Workloads;
  let fixture: ComponentFixture<Workloads>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Workloads]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Workloads);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
