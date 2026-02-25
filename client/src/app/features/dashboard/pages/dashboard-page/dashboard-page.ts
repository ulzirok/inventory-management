import { Component, DestroyRef, inject, signal } from '@angular/core';
import { LastInventory } from '../../components/last-inventory/last-inventory';
import { TopInventory } from '../../components/top-inventory/top-inventory';
import { Tags } from '../../components/tags/tags';
import { Router } from '@angular/router';
import { Tag } from '../../../search/models/search.interface';
import { DashboardService } from '../../services/dashboard.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard-page',
  imports: [LastInventory, TopInventory, Tags],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  tags = signal<Tag[]>([]);
  private dashboardService = inject(DashboardService)
  private router = inject(Router)
  private destroyRef = inject(DestroyRef);
  
  ngOnInit(): void {
    this.dashboardService.getTags().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      data => this.tags.set(data)
    )
  }
  
  onSearchByTag(tag: string) {
    this.router.navigate(['/search'], { queryParams: { tag: tag } });
  }
  
}
