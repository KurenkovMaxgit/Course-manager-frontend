import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  Component,
  ContentChild,
  inject,
  Input,
  OnInit,
  Optional,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MatButtonModule],
  templateUrl: './form.html',
  styleUrls: ['./form.scss'],
})
export class Form implements OnInit {
  http = inject(HttpClient);
  id = signal('');
  isNew = false;
  @Input() model = '';
  @ContentChild(FormGroupDirective) formGroupDir?: FormGroupDirective;
  private activatedRoute = inject(ActivatedRoute);

  constructor(
    @Optional() private dialogRef: MatDialogRef<Form>,
    private location: Location,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
    if (this.router.url.endsWith(`/new`)) {
      this.isNew = true;
    }
  }

  ngOnInit() {
    this.dialogRef = this.dialog.open(this.dialogTemplate(), { width: '70%' });
    this.dialogRef.afterClosed().subscribe(() => {
      this.location.back();
    });

    return this.dialogRef;
  }

  readonly dialogTemplate = viewChild.required(TemplateRef);
  readonly dialog = inject(MatDialog);

  Submit() {
    const form = this.formGroupDir?.form;
    if (form?.valid) {
      if (this.isNew) {
        this.http.post(`http://localhost:3000/api/${this.model}`, form.value).subscribe({
          next: (res) => console.log('Success:', res),
          error: (err) => console.error('Error:', err),
        });
      } else
        this.http.put(`http://localhost:3000/api/${this.model}/${this.id}`, form.value).subscribe({
          next: (res) => console.log('Success:', res),
          error: (err) => console.error('Error:', err),
        });
    }
  }
}
