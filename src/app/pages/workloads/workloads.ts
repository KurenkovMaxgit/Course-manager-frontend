import { Component } from '@angular/core';
import { WorkloadTable } from '../../components/workload-table/workload-table';

@Component({
  selector: 'app-workloads',
  imports: [WorkloadTable],
  templateUrl: './workloads.html',
  styleUrl: './workloads.scss',
})
export class Workloads {}
