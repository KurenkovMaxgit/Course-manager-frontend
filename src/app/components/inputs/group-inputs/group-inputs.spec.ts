import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupInputs } from './group-inputs';

describe('GroupInputs', () => {
  let component: GroupInputs;
  let fixture: ComponentFixture<GroupInputs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupInputs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupInputs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
