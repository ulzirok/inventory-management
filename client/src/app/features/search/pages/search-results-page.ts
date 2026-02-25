import { Component, DestroyRef, inject } from '@angular/core';
import { SearchService } from '../../../core/services/search.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-results-page',
  imports: [TranslateModule],
  templateUrl: './search-results-page.html',
  styleUrl: './search-results-page.scss',
})
export class SearchResultsPage {
  public searchService = inject(SearchService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

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
}
