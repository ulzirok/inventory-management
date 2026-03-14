import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input, output, signal, ViewChild } from '@angular/core';
import { User, UserDto } from '../../models/user.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { TableParams } from '../../../../core/models/tableParams.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, map, Subject } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-users-list',
  imports: [
    TranslateModule,
    MatTableModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule
  ],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersList {
  users = input<User[]>([]);
  totalCount = input<number>(0);
  changeUserStatus = output<UserDto>();
  changeUserRole = output<UserDto>();
  deleteUsersById = output<number[]>();
  getUserById = output<number>();
  paramsChange = output<TableParams>();

  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private breakpointObserver = inject(BreakpointObserver);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  currentSearch = '';
  private search$ = new Subject<string>();

  dataSource = new MatTableDataSource<User>([]);
  displayedColumns = ['select', 'name', 'email', 'status', 'role'];
  selection = new SelectionModel<User>(true, []);
  private selectedCount = signal(0);
  isSingleSelected = computed(() => this.selectedCount() === 1);
  hasSelection = computed(() => this.selectedCount() > 0);

  syncDataEffect = effect(() => {
    this.dataSource.data = this.users();
  });
  
  isMobile = toSignal(
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet]).pipe(
      map(result => result.matches)
    )
  );

  ngOnInit() {
    this.search$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.currentSearch = value;
      if (this.paginator) this.paginator.pageIndex = 0;
      this.emitParams();
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  private emitParams() {
    this.paramsChange.emit({
      page: this.paginator?.pageIndex + 1 || 1,
      limit: this.paginator?.pageSize || 10,
      search: this.currentSearch,
      sort: this.sort?.active || 'id',
      order: this.sort?.direction || 'desc'
    });
  }

  filter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search$.next(value);
  }

  onPageChange(event: PageEvent) {
    this.emitParams();
  }

  onSortChange(sortState: Sort) {
    if (this.paginator) this.paginator.pageIndex = 0;
    this.paramsChange.emit({
      page: 1,
      limit: this.paginator?.pageSize || 10,
      search: this.currentSearch,
      sort: sortState.active,
      order: (sortState.direction || 'desc') as 'asc' | 'desc' | ''
    });
  }

  updateSelectionCount() {
    this.selectedCount.set(this.selection.selected.length);
  }

  isAllSelected() {
    return this.dataSource.data.length > 0 && this.selection.selected.length === this.dataSource.data.length;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.data);
    }
    this.updateSelectionCount();
  }

  toggleRow(user: User) {
    this.selection.toggle(user);
    this.updateSelectionCount();
  }

  changeStatus() {
    if (!this.hasSelection()) return;
    const selectedUsers = this.selection.selected;
    const upload: UserDto = {
      ids: selectedUsers.map(user => user.id),
      isBlocked: selectedUsers.some(user => !user.isBlocked)
    };
    this.changeUserStatus.emit(upload);
    this.selection.clear();
    this.updateSelectionCount();
  }

  changeRole() {
    if (!this.hasSelection()) return;
    const selectedUsers = this.selection.selected;
    const hasUser = selectedUsers.some(user => user.role === 'USER');
    const upload = {
      ids: selectedUsers.map(u => u.id),
      role: hasUser ? 'ADMIN' : 'USER'
    };
    this.changeUserRole.emit(upload);
    this.selection.clear();
    this.updateSelectionCount();
  }

  deleteUsers() {
    if (!this.hasSelection()) return;
    const dialogRef = this.dialog.open(ConfirmDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      const ids = this.selection.selected.map(item => item.id);
      this.deleteUsersById.emit(ids);
      this.selection.clear();
      this.updateSelectionCount();
    });
  }

  getUser() {
    if (!this.isSingleSelected()) return;
    const id = this.selection.selected[0].id;
    this.getUserById.emit(id);
    this.selection.clear();
    this.updateSelectionCount();
  }

}
