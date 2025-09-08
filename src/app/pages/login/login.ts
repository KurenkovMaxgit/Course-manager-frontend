import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  private router = inject(Router);
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  submitting = false;
  errorMessage = '';

  submit() {
    if (this.form.invalid) return;

    this.submitting = true;
    this.errorMessage = '';

    const { email, password } = this.form.value;

    this.http
      .post<ApiResponse>('http://localhost:3000/api/login', { email, password })
      .subscribe({
        next: (res) => {
          this.auth.setToken(res.token);  
          this.router.navigate(['/teacher']);
        },
        error: (err) => {
          console.error('Error:', err);
          this.errorMessage = 'Invalid email or password';
        },
        complete: () => (this.submitting = false),
      });
  }
}

type ApiResponse = {
  token: string;
};