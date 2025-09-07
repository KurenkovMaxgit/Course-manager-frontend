import { Component } from '@angular/core';
import { Table } from '../../components/table/table';

@Component({
  selector: 'app-groups',
  imports: [Table],
  standalone: true,
  templateUrl: './groups.html',
  styleUrl: './groups.scss',
})
export class Groups {}
