import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form',
  imports: [],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form {
  id = signal('');
  title = signal('New Teacher');
  isNew = true

  private activatedRoute = inject(ActivatedRoute);
  constructor() {
    // Access route parameters
    this.activatedRoute.params.subscribe((params) => {
      this.id.set(params['id']);
      if (this.id()) {
        this.title.set(`Editing Teacher #${params['id']}`);
      }
    });
  }
}
