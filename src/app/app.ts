import { Component, inject, signal } from '@angular/core';
import { AuthService } from './services/auth-service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = 'course-manager';
  token = inject(AuthService).token;
}
