import { Component, inject, signal } from '@angular/core';
import { Form } from '../../form/form';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
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
  model = 'teacher';
  http = inject(HttpClient);
  private activatedRoute = inject(ActivatedRoute);
  id = '';
  teacher = signal<Teacher | null>(null);
  form = new FormGroup({
    name: new FormControl(this.teacher()?.name || ''),
    surname: new FormControl(this.teacher()?.surname || ''),
    middleName: new FormControl(this.teacher()?.middleName || ''),
    phone: new FormControl(this.teacher()?.phone || ''),
    experience: new FormControl(this.teacher()?.experience || ''),
  });

  constructor(private router: Router) {
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
      error: (err) => console.error('Error:', err),
    });
  }
}
