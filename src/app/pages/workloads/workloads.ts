import { Component } from '@angular/core';
import { Table } from '../../components/table/table';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-workloads',
  imports: [Table],
  templateUrl: './workloads.html',
  styleUrl: './workloads.scss',
})
export class Workloads {}
