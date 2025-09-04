import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, inject, Input } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-table',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    // RouterLink,
    MatIcon,
    MatButtonModule,
  ],
  templateUrl: './table.html',
  styleUrls: ['./table.scss'],
})
export class Table<T> implements AfterViewInit {
  private _httpClient = inject(HttpClient);

  displayedColumns: string[] = [];
  @Input() columnLabels: string[] = [];
  @Input() inputColumns: string[] = [];
  @Input() apiUrl = '';

  constructor() {}

  data: T[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private database!: HttpDatabase<T>;

  ngAfterViewInit() {
    this.columnLabels.push('Actions');
    this.displayedColumns.push(...this.inputColumns, 'actions');
    console.log(this.columnLabels);
    if (!this.apiUrl) throw new Error('apiUrl input is required!');
    this.database = new HttpDatabase<T>(this._httpClient, this.apiUrl);

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
              filter: {},
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
  addNew() {}
  startEdit(i: number, id: number, title: string, state: string, url: string, created_at: string) {}
  deleteItem(i: number) {}
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

// @Component({
//   selector: 'app-table',
//   imports: [
//     MatProgressSpinnerModule,
//     MatTableModule,
//     MatSortModule,
//     MatPaginatorModule,
//     MatInputModule,
//     MatFormFieldModule,
//   ],
//   templateUrl: './table.html',
//   styleUrl: './table.scss',
// })
// export class Table implements AfterViewInit {
//   private _httpClient = inject(HttpClient);

//   displayedColumns: string[] = ['name', 'surname', 'middleName', 'phone', 'experience'];
//   Database!: HttpDatabase | null;
//   data: Teacher[] = [];

//   resultsLength = 0;
//   isLoadingResults = true;
//   isRateLimitReached = false;

//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;

//   ngAfterViewInit() {
//     this.Database = new HttpDatabase(this._httpClient);

//     // If the user changes the sort order, reset back to the first page.
//     this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

//     merge(this.sort.sortChange, this.paginator.page)
//       .pipe(
//         startWith({}),
//         switchMap(() => {
//           this.isLoadingResults = true;
//           return this.Database!.getTeachers({
//             filter: {},
//             // { middleName: 'ABOBOV' }
//             sort: { [this.sort.active]: this.sort.direction === 'asc' ? -1 : 1 },
//             limit: this.paginator.pageSize,
//             page: this.paginator.pageIndex,
//           }).pipe(catchError(() => observableOf(null)));
//         }),
//         map((data) => {
//           // Flip flag to show that loading has finished.
//           this.isLoadingResults = false;
//           this.isRateLimitReached = data === null;

//           if (data === null) {
//             return [];
//           }

//           // Only refresh the result length if there is new data. In case of rate
//           // limit errors, we do not want to reset the paginator to zero, as that
//           // would prevent users from re-triggering requests.
//           this.resultsLength = data.total_count;
//           return data.items;
//         })
//       )
//       .subscribe((data) => (this.data = data));
//   }
//   // applyFilter(event: Event) {
//   //   const filterValue = (event.target as HTMLInputElement).value;
//   //   this.dataSource.filter = filterValue.trim().toLowerCase();

//   //   if (this.dataSource.paginator) {
//   //     this.dataSource.paginator.firstPage();
//   //   }
//   // }
// }

// export interface TeacherApi {
//   items: Teacher[];
//   total_count: number;
// }

// /** An example database that the data source uses to retrieve data for the table. */
// export class HttpDatabase {
//   constructor(private _httpClient: HttpClient) {}

//   getTeachers(params: {
//     filter: object;
//     sort: object;
//     limit: number;
//     page: number;
//   }): Observable<TeacherApi> {
//     const queryParams = new URLSearchParams();
//     queryParams.append('filter', JSON.stringify(params.filter));
//     queryParams.append('sort', JSON.stringify(params.sort));
//     queryParams.append('limit', params.limit.toString());
//     queryParams.append('page', params.page.toString());
//     const href = 'http://localhost:3000/api/teacher';
//     console.log(queryParams.toString());
//     const requestUrl = `${href}?${queryParams.toString()}`;

//     return this._httpClient.get<TeacherApi>(requestUrl);
//   }
// }
// export interface Teacher {
//   name: string;
//   surname: string;
//   middleName: string;
//   phone: string;
//   experience: string;
// }
