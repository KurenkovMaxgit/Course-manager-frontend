import { Component, inject, signal } from '@angular/core';
import { Form } from '../../form/form';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Workload } from '../../../models/workload.model';
import { MatSelectModule } from '@angular/material/select';
import { Teacher } from '../../../models/teacher.model';
import { Group } from '../../../models/group.model';
import { Subject } from '../../../models/subject.model';
import { LessonType } from '../../../models/lesson-type.model';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-workload-inputs',
  imports: [
    Form,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule,
    MatAutocompleteModule,
  ],
  templateUrl: './workload-inputs.html',
  styleUrl: './workload-inputs.scss',
})
export class WorkloadInputs {
  validated = signal(true);
  model = 'workload';
  http = inject(HttpClient);
  private activatedRoute = inject(ActivatedRoute);
  id = '';
  teachers = signal<Teacher[] | null>(null);
  groups = signal<Group[] | null>(null);
  subjects = signal<Subject[] | null>(null);
  types = signal<LessonType[] | null>(null);
  workload = signal<Workload | null>(null);
  form = new FormGroup({
    teacher: new FormControl(this.workload()?._id, Validators.required),
    group: new FormControl(this.workload()?.group._id, Validators.required),
    subject: new FormControl(this.workload()?.subject._id, Validators.required),
    type: new FormControl(this.workload()?.type._id, Validators.required),
    hours: new FormControl(this.workload()?.hours, [
      Validators.required,
      Validators.maxLength(4),
      Validators.min(0),
    ]),
    price: new FormControl(this.workload()?.price, [
      Validators.required,
      Validators.maxLength(10),
      Validators.min(0),
    ]),
  });

  constructor(private router: Router, private location: Location) {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
    if (!this.router.url.endsWith(`/new`)) {
      this.getWorkloadById();
    }
  }
  ngAfterViewInit() {
    this.getAllOptions();
  }

  getAllOptions() {
    this.http.get<ApiResponse<Teacher>>(`http://localhost:3000/api/teacher`).subscribe({
      next: (res) => this.teachers.set(res.items),
      error: (err) => console.error('Error:', err),
    });
    this.http.get<ApiResponse<Group>>(`http://localhost:3000/api/group`).subscribe({
      next: (res) => this.groups.set(res.items),
      error: (err) => console.error('Error:', err),
    });
    this.http.get<ApiResponse<Subject>>(`http://localhost:3000/api/subject`).subscribe({
      next: (res) => this.subjects.set(res.items),
      error: (err) => console.error('Error:', err),
    });
    this.http.get<LessonType[]>(`http://localhost:3000/api/lessonType`).subscribe({
      next: (res) => this.types.set(res),
      error: (err) => console.error('Error:', err),
    });
  }

  getWorkloadById() {
    this.http.get<Workload>(`http://localhost:3000/api/workload/${this.id}`).subscribe({
      next: (res) => {
        this.workload.set(res);
        this.form.patchValue({
          teacher: res.teacher._id,
          group: res.group._id,
          subject: res.subject._id,
          type: res.type._id,
          hours: res.hours,
          price: res.price,
        });
      },
      error: (err) => {
        console.error('Error:', err);
        this.location.back();
      },
    });
  }
}

export interface ApiResponse<T> {
  items: T[];
  total_count: number;
}
