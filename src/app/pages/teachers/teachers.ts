import { Component } from '@angular/core';
import { Table } from '../../components/table/table';

@Component({
  selector: 'app-teachers',
  imports: [Table],
  standalone: true,
  templateUrl: './teachers.html',
  styleUrl: './teachers.scss',
})
export class Teachers {}
