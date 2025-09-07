import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  private router = inject(Router);

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

    setTimeout(() => {
      this.submitting = false;

      if (email === 'admin@example.com' && password === 'password') {
        this.router.navigate(['/']);
      } else {
        this.errorMessage = 'Invalid email or password';
      }
    }, 1000);
  }
}
