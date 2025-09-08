import { Component, inject, signal } from '@angular/core';
import { Form } from '../../form/form';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Teacher } from '../../../models/teacher.model';

@Component({
  selector: 'app-teacher-inputs',
  imports: [Form, MatInputModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './teacher-inputs.html',
  styleUrl: './teacher-inputs.scss',
})
export class TeacherInputs {
  validated = signal(true);
  model = 'teacher';
  http = inject(HttpClient);
  private activatedRoute = inject(ActivatedRoute);
  id = '';
  teacher = signal<Teacher | null>(null);
  form = new FormGroup({
    name: new FormControl(this.teacher()?.name, [Validators.required, Validators.maxLength(64)]),
    surname: new FormControl(this.teacher()?.surname, [
      Validators.required,
      Validators.maxLength(64),
    ]),
    middleName: new FormControl(this.teacher()?.middleName, [
      Validators.required,
      Validators.maxLength(64),
    ]),
    phone: new FormControl(this.teacher()?.phone, [
      Validators.required,
      Validators.pattern(/^\+?\d{7,15}$/),
      Validators.minLength(7),
      Validators.maxLength(15),
    ]),
    experience: new FormControl(this.teacher()?.experience, [
      Validators.required,
      Validators.maxLength(256),
    ]),
  });

  ngDoCheck() {
    if (this.form.valid) {
      this.validated.set(true);
    } else {
      this.validated.set(false);
    }
  }

  constructor(private router: Router, private location: Location) {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
    if (!this.router.url.endsWith(`/new`)) {
      this.getTeacherById();
    }
  }

  getTeacherById() {
    this.http.get<Teacher>(`http://localhost:3000/api/teacher/${this.id}`).subscribe({
      next: (res) => {
        this.teacher.set(res);
        this.form.patchValue({
          name: res.name,
          surname: res.surname,
          middleName: res.middleName,
          phone: res.phone,
          experience: res.experience,
        });
      },
      error: (err) => {
        console.error('Error:', err);
        this.location.back();
      },
    });
  }
}
