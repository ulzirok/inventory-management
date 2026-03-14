import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input, output, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { Inventory } from '../../models/inventory.interface';
import { AuthService } from '../../../../core/services/auth.service';
import { Role } from '../../../auth/models/role.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { MarkdownComponent } from 'ngx-markdown';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TableParams } from '../../../../core/models/tableParams.interface';
import { debounceTime, distinctUntilChanged, map, Subject } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-inventory-list',
  imports: [
    TranslateModule,
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MarkdownComponent,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule
  ],
  templateUrl: './inventory-list.html',
  styleUrl: './inventory-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryList {
  inventories = input<Inventory[]>([]);
  isEditable = input<boolean>(false);
  showViewItems = input<boolean>(true);
  showChat = input<boolean>(true);
  totalCount = input<number>(0);
  settingsInventory = output<number>();
  deleteInventory = output<number[]>();
  viewItems = output<number>();
  viewChats = output<number>();
  viewAllItems = output<void>();
  createInventory = output<void>();
  paramsChange = output<TableParams>();

  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private breakpointObserver = inject(BreakpointObserver);

  isAuthenticated = computed(() => this.authService.isAuthenticated());
  isAdmin = computed(() => this.authService.hasRole(Role.ADMIN));
  canManage = computed(() => this.isAdmin() || this.isEditable());

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  currentSearch = '';
  private search$ = new Subject<string>();

  dataSource = new MatTableDataSource<Inventory>([]);
  displayedColumns = ['select', 'title', 'description', 'categoryId', 'authorId', 'imageUrl'];
  selection = new SelectionModel<Inventory>(true, []);
  private selectedCount = signal(0);
  isSingleSelected = computed(() => this.selectedCount() === 1);
  hasSelection = computed(() => this.selectedCount() > 0);

  syncDataEffect = effect(() => {
    this.dataSource.data = this.inventories();
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
      sort: this.sort?.active || 'updatedAt',
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
    const data = this.dataSource.data;
    return data.length > 0 && this.selection.selected.length === data.length;
  }

  toggleAllRows() {
    const data = this.dataSource.data;
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...data);
    }
    this.updateSelectionCount();
  }

  toggleRow(inventory: Inventory) {
    this.selection.toggle(inventory);
    this.updateSelectionCount();
  }

  create() {
    this.createInventory.emit();
  }

  settings() {
    if (!this.isSingleSelected()) return;
    const id = this.selection.selected[0].id;
    this.settingsInventory.emit(id);
    this.selection.clear();
    this.updateSelectionCount();
  }

  delete() {
    if (!this.hasSelection()) return;
    const ids = this.selection.selected.map(item => item.id);
    const dialogRef = this.dialog.open(ConfirmDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.deleteInventory.emit(ids);
      this.selection.clear();
      this.updateSelectionCount();
    });
  }

  viewItem() {
    if (!this.isSingleSelected()) return;
    const id = this.selection.selected[0].id;
    this.viewItems.emit(id);
    this.selection.clear();
    this.updateSelectionCount();
  }

  viewChat() {
    if (!this.isSingleSelected()) return;
    const id = this.selection.selected[0].id;
    this.viewChats.emit(id);
    this.selection.clear();
    this.updateSelectionCount();
  }
}
