import { Component, inject, signal } from '@angular/core';
import { Form } from '../../form/form';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from '../../../models/subject.model';

@Component({
  selector: 'app-subject-inputs',
  imports: [Form, MatInputModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './subject-inputs.html',
  styleUrl: './subject-inputs.scss',
})
export class SubjectInputs {
  validated = signal(true);
  model = 'subject';
  http = inject(HttpClient);
  private activatedRoute = inject(ActivatedRoute);
  id = '';
  subject = signal<Subject | null>(null);
  form = new FormGroup({
    name: new FormControl(this.subject()?.name, [Validators.required, Validators.maxLength(64)]),
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
      this.getSubjectById();
    }
  }

  getSubjectById() {
    this.http.get<Subject>(`http://localhost:3000/api/subject/${this.id}`).subscribe({
      next: (res) => {
        this.subject.set(res);
        this.form.patchValue({
          name: res.name,
        });
      },
      error: (err) => {
        console.error('Error:', err);
        this.location.back();
      },
    });
  }
}
