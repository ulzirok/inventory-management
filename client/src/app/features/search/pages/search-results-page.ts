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

  inventories = computed(() => this.searchService.results());
  dataSource = computed(() => this.inventories());
  displayedColumns = ['select', 'customId', 'title', 'description', 'categoryId', 'imageUrl'];
  selection = new SelectionModel<Inventory>(false, []);
  private selectedCount = signal(0);
  isSingleSelected = computed(() => this.selectedCount() === 1);

  updateSelectionCount() {
    this.selectedCount.set(this.selection.selected.length);
  }

  toggleRow(row: Inventory) {
    this.selection.toggle(row);
    this.updateSelectionCount();
  }

  ngOnInit() {
    this.route.queryParams.pipe(
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

  viewItem() {
    if (!this.isSingleSelected()) return;
    const id = this.selection.selected[0].id;
    this.router.navigate([`/dashboard/${id}/items`]);
    this.selection.clear();
  }
}
