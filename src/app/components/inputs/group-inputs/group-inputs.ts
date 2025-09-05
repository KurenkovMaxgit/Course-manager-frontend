import { Component, inject, signal } from '@angular/core';
import { Form } from '../../form/form';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../../../models/group.model';

@Component({
  selector: 'app-group-inputs',
  imports: [Form, MatInputModule, ReactiveFormsModule],
  templateUrl: './group-inputs.html',
  styleUrl: './group-inputs.scss',
})
export class GroupInputs {
  model = 'group';
  http = inject(HttpClient);
  private activatedRoute = inject(ActivatedRoute);
  id = '';
  group = signal<Group | null>(null);
  form = new FormGroup({
    faculty: new FormControl(this.group()?.faculty || ''),
    specialty: new FormControl(this.group()?.specialty || ''),
    studentCount: new FormControl(this.group()?.studentCount || 0),
  });

  constructor(private router: Router) {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
    if (!this.router.url.endsWith(`/new`)) {
      this.getGroupById();
    }
  }

  getGroupById() {
    this.http.get<Group>(`http://localhost:3000/api/group/${this.id}`).subscribe({
      next: (res) => {
        this.group.set(res);
        this.form.patchValue({
          faculty: res.faculty,
          specialty: res.specialty,
          studentCount: res.studentCount,
        });
      },
      error: (err) => console.error('Error:', err),
    });
  }
}
