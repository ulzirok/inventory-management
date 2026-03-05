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
import { Inventory } from '../../inventory/models/inventory.interface';
import { debounceTime, distinctUntilChanged, EMPTY, switchMap } from 'rxjs';
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
  displayedColumns = ['select', 'customId', 'inventory', 'description', 'category', 'image'];
  selection = new SelectionModel<Inventory>(true, []);
  private selectedCountSignal = signal(0);
  isSingleSelected = computed(() => this.selectedCountSignal() === 1);
  isAnySelected = computed(() => this.selectedCountSignal() > 0);
  
  ngOnInit() {
    this.route.queryParams.pipe(
      debounceTime(400),
      distinctUntilChanged((prev, curr) =>
        prev['q'] === curr['q'] && prev['tag'] === curr['tag']
      ),
      switchMap(params => {
        const tag = params['tag'];
        const query = params['q'];
        if (tag) {
          return this.searchService.searchByTag(tag);
        } else if (query) {
          return this.searchService.search(query);
        }
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
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

    this.router.navigate([`/dashboard/${id}/items`])
    this.selection.clear();
  }
  
  
}
