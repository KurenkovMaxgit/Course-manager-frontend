import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, inject, Input, signal } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { merge, Observable, of as observableOf, Subject } from 'rxjs';
import { catchError, filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { Workload, WorkloadTableRow } from '../../models/workload.model';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Teacher } from '../../models/teacher.model';
import { Group } from '../../models/group.model';
import { LessonType } from '../../models/lesson-type.model';
import { Subject as courseSubject } from '../../models/subject.model';

@Component({
  selector: 'app-workload-table',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatIcon,
    MatButtonModule,
    MatDialogModule,
    RouterOutlet,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './workload-table.html',
  styleUrls: ['./workload-table.scss'],
})
export class WorkloadTable {
  private http = inject(HttpClient);
  teachers = signal<Teacher[] | null>(null);
  groups = signal<Group[] | null>(null);
  subjects = signal<courseSubject[] | null>(null);
  types = signal<LessonType[] | null>(null);
  teacher = new FormControl(null);
  group = new FormControl(null);
  subject = new FormControl(null);
  type = new FormControl(null);
  displayedColumns: string[] = [];
  model = 'workload';
  @Input() columnLabels: string[] = [];
  @Input() inputColumns: string[] = [];
  apiUrl = '';
  constructor(private router: Router) {}

  data: WorkloadTableRow[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private database!: HttpDatabase<Workload>;

  ngOnInit() {
    this.apiUrl = `http://localhost:3000/api/${this.model}`;
    this.columnLabels.push('Actions');
    this.displayedColumns.push(...this.inputColumns, 'actions');
    this.database = new HttpDatabase<Workload>(this.http, this.apiUrl);
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.router.url.endsWith(`/${this.model}`)) {
          this.renderTable();
        }
      });
    this.getAllOptions();
    merge(
      this.teacher.valueChanges,
      this.group.valueChanges,
      this.subject.valueChanges,
      this.type.valueChanges
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // при зміні будь-якого фільтру — повертаємося на першу сторінку
        this.paginator.pageIndex = 0;
        this.renderTable();
      });
  }

  renderTable() {
    if (!this.apiUrl) throw new Error('apiUrl input is required!');
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.database
            .getData({
              sort: { [this.sort.active]: this.sort.direction === 'asc' ? -1 : 1 },
              limit: this.paginator.pageSize,
              page: this.paginator.pageIndex,
              filter: {
                teacher: this.teacher.value || null,
                group: this.group.value || null,
                subject: this.subject.value || null,
                type: this.type.value || null,
              },
            })
            .pipe(catchError(() => observableOf(null)));
        }),
        map((data) => {
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;
          if (!data) return [];
          this.resultsLength = data.total_count;
          return (this.data = data.items.map(
            (w): WorkloadTableRow => ({
              _id: w._id,
              teacher: `${w.teacher.surname} ${w.teacher.name}`,
              group: w.group.faculty,
              subject: w.subject.name,
              type: w.type.name,
              hours: w.hours,
              price: `${w.price} $`,
            })
          ));
        })
      )
      .subscribe((data) => (this.data = data));
  }

  ngAfterViewInit() {
    if (!this.apiUrl) throw new Error('apiUrl input is required!');

    // Об'єднуємо всі стріми: сортування, пагінатор, зміни фільтрів
    merge(
      this.sort.sortChange,
      this.paginator.page,
      this.teacher.valueChanges,
      this.group.valueChanges,
      this.subject.valueChanges,
      this.type.valueChanges
    )
      .pipe(
        startWith({}), // щоб відразу завантажити дані
        switchMap(() => {
          this.isLoadingResults = true;
          // Повертаємо на першу сторінку при зміні фільтра
          if (this.teacher.dirty || this.group.dirty || this.subject.dirty || this.type.dirty) {
            this.paginator.pageIndex = 0;
          }

          return this.database
            .getData({
              sort: { [this.sort.active]: this.sort.direction === 'asc' ? 1 : -1 },
              limit: this.paginator.pageSize,
              page: this.paginator.pageIndex,
              filter: {
                teacher: this.teacher.value || null,
                group: this.group.value || null,
                subject: this.subject.value || null,
                type: this.type.value || null,
              },
            })
            .pipe(catchError(() => observableOf(null)));
        }),
        map((data) => {
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;
          if (!data) return [];
          this.resultsLength = data.total_count;
          return data.items.map(
            (w): WorkloadTableRow => ({
              _id: w._id,
              teacher: `${w.teacher.surname} ${w.teacher.name}`,
              group: w.group.faculty,
              subject: w.subject.name,
              type: w.type.name,
              hours: w.hours,
              price: `${w.price} $`,
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => (this.data = data));
  }

  startEdit(i: number) {
    const id = this.data[i]._id;
    this.router.navigate([`/${this.model}/${id}`]);
  }

  addNew() {
    this.router.navigate([`/${this.model}/new`]);
  }
  deleteItem(i: number) {
    const id = this.data[i]._id;
    this.http.delete(`http://localhost:3000/api/${this.model}/${id}`).subscribe({
      next: () => {
        console.log('Deleted:', id);
        this.data.splice(i, 1);
        this.data = [...this.data];
        this.resultsLength--;
        this.renderTable();
      },
      error: (err) => console.error('Error:', err),
    });
  }

  getAllOptions() {
    this.http.get<ApiResponse<Teacher>>(`http://localhost:3000/api/teacher`).subscribe({
      next: (res) => this.teachers.set(res.items),
      error: (err) => console.error('Error:', err),
    });
    this.http.get<ApiResponse<Group>>(`http://localhost:3000/api/group`).subscribe({
      next: (res) => this.groups.set(res.items),
      error: (err) => console.error('Error:', err),
    });
    this.http.get<ApiResponse<courseSubject>>(`http://localhost:3000/api/subject`).subscribe({
      next: (res) => this.subjects.set(res.items),
      error: (err) => console.error('Error:', err),
    });
    this.http.get<LessonType[]>(`http://localhost:3000/api/lessonType`).subscribe({
      next: (res) => this.types.set(res),
      error: (err) => console.error('Error:', err),
    });
  }
}

export interface ApiResponse<Workload> {
  items: Workload[];
  total_count: number;
}

export class HttpDatabase<Workload> {
  constructor(private _httpClient: HttpClient, private apiUrl: string) {}

  getData(params: {
    filter: Record<string, any>;
    sort: Record<string, any>;
    limit: number;
    page: number;
  }): Observable<ApiResponse<Workload>> {
    const queryParams = new URLSearchParams();
    const filteredFilter: Record<string, any> = {};
    Object.keys(params.filter).forEach((key) => {
      const value = params.filter[key];
      if (value !== null && value !== undefined && value !== '') {
        filteredFilter[key] = value;
      }
    });

    if (Object.keys(filteredFilter).length > 0) {
      queryParams.append('filter', JSON.stringify(filteredFilter));
    }

    queryParams.append('sort', JSON.stringify(params.sort));
    queryParams.append('limit', params.limit.toString());
    queryParams.append('page', params.page.toString());

    const requestUrl = `${this.apiUrl}?${queryParams.toString()}`;
    return this._httpClient.get<ApiResponse<Workload>>(requestUrl);
  }
}
