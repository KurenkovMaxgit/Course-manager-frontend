import { Component, inject, signal } from '@angular/core';
import { Form } from '../../form/form';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Workload } from '../../../models/workload.model';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-workload-inputs',
  imports: [Form, MatInputModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './workload-inputs.html',
  styleUrl: './workload-inputs.scss',
})
export class WorkloadInputs {
  model = 'workload';
  http = inject(HttpClient);
  private activatedRoute = inject(ActivatedRoute);
  id = '';
  workload = signal<Workload | null>(null);
  form = new FormGroup({
    teacher: new FormControl(this.workload()?.teacher || ''),
    group: new FormControl(this.workload()?.group || ''),
    subject: new FormControl(this.workload()?.subject || ''),
    type: new FormControl(this.workload()?.type || ''),
    hours: new FormControl(this.workload()?.hours || 0),
    price: new FormControl(this.workload()?.price || 0),
  });

  constructor(private router: Router) {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
    if (!this.router.url.endsWith(`/new`)) {
      this.getWorkloadById();
    }
  }

  getWorkloadById() {
    this.http.get<Workload>(`http://localhost:3000/api/workload/${this.id}`).subscribe({
      next: (res) => {
        this.workload.set(res);
        this.form.patchValue({
          teacher: res.teacher,
          group: res.group,
          subject: res.subject,
          type: res.type,
          hours: res.hours,
          price: res.price,
        });
      },
      error: (err) => console.error('Error:', err),
    });
  }
}
