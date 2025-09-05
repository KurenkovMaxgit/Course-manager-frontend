import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, inject, Input } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { merge, Observable, of as observableOf, Subject } from 'rxjs';
import { catchError, filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-table',
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
  ],
  templateUrl: './table.html',
  styleUrls: ['./table.scss'],
})
export class Table<T extends HasId> {
  private http = inject(HttpClient);

  displayedColumns: string[] = [];
  @Input() model: string = '';
  @Input() columnLabels: string[] = [];
  @Input() inputColumns: string[] = [];
  apiUrl = '';
  constructor(private router: Router) {}

  data: T[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private database!: HttpDatabase<T>;

  ngOnInit() {
    this.apiUrl = `http://localhost:3000/api/${this.model}`;
    this.columnLabels.push('Actions');
    this.displayedColumns.push(...this.inputColumns, 'actions');
    this.database = new HttpDatabase<T>(this.http, this.apiUrl);
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        // Check if we’re *not* on the dialog route anymore
        if (this.router.url.endsWith(`/${this.model}`)) {
          this.renderTable();
        }
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
              filter: {}, //Can handle search 💪🏿💪🏿💪🏿
            })
            .pipe(catchError(() => observableOf(null)));
        }),
        map((data) => {
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;
          if (!data) return [];
          this.resultsLength = data.total_count;
          return data.items;
        })
      )
      .subscribe((data) => (this.data = data));
  }

  ngAfterViewInit() {
    this.renderTable();
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
}

interface HasId {
  _id: string;
}

export interface ApiResponse<T> {
  items: T[];
  total_count: number;
}

export class HttpDatabase<T> {
  constructor(private _httpClient: HttpClient, private apiUrl: string) {}

  getData(params: {
    filter: object;
    sort: object;
    limit: number;
    page: number;
  }): Observable<ApiResponse<T>> {
    const queryParams = new URLSearchParams();
    queryParams.append('filter', JSON.stringify(params.filter));
    queryParams.append('sort', JSON.stringify(params.sort));
    queryParams.append('limit', params.limit.toString());
    queryParams.append('page', params.page.toString());

    const requestUrl = `${this.apiUrl}?${queryParams.toString()}`;
    return this._httpClient.get<ApiResponse<T>>(requestUrl);
  }
}
