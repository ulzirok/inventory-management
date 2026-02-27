import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { SearchService } from '../../../core/services/search.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../auth/models/role.enum';
import { Inventory } from '../../inventory/models/inventory.interface';
@Component({
  selector: 'app-search-results-page',
  imports: [
    TranslateModule,
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './search-results-page.html',
  styleUrl: './search-results-page.scss',
})
export class SearchResultsPage {
  public searchService = inject(SearchService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  public inventories = computed(() => this.searchService.results());
  dataSource = computed(() => this.inventories());
  displayedColumns = ['select', 'customId', 'inventory', 'description', 'category']; //+картинка
  selection = new SelectionModel<Inventory>(true, []);
  private selectedCountSignal = signal(0);
  isSingleSelected = computed(() => this.selectedCountSignal() === 1);
  isAnySelected = computed(() => this.selectedCountSignal() > 0);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tag = params['tag'];
      const query = params['q'];
      if (tag) {
        this.searchService.searchByTag(tag).pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe();
      } else if (query) {
        this.searchService.search(query).pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe();
      }
    });
  }

  updateSelectionCount() {
    this.selectedCountSignal.set(this.selection.selected.length);
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource().length;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource());
    }
    this.updateSelectionCount();
  }

  toggleRow(row: Inventory) {
    this.selection.toggle(row);
    this.updateSelectionCount();
  }

  viewItem() {
    if (!this.isSingleSelected()) return;
    const id = this.selection.selected[0].id;
    this.router.navigate([`/inventory/${id}/item`])
    this.selection.clear();
  }
  
  viewAllItems() {
    this.router.navigate(['/inventory/items'])
  }
  
}
