import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Tag } from '../../../search/models/search.interface';
import { DashboardService } from '../../services/dashboard.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LastInventory } from '../../components/last-inventory/last-inventory';
import { TopInventory } from '../../components/top-inventory/top-inventory';
import { Tags } from '../../components/tags/tags';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { Inventory } from '../../../inventory/models/inventory.interface';

@Component({
  selector: 'app-dashboard-page',
  imports: [LastInventory, TopInventory, Tags, CommonModule, MatButtonModule, TranslateModule, MatIconModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  private dashboardService = inject(DashboardService)
  private router = inject(Router)
  private destroyRef = inject(DestroyRef);
  
  public tags = signal<Tag[]>([]);
  public latestInventory = signal<Inventory[]>([]);
  public topInventory = signal<Inventory[]>([]);
  
  ngOnInit(): void {
    this.dashboardService.getTags().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      data => this.tags.set(data)
    )
    
    this.dashboardService.getLatest().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      data => this.latestInventory.set(data)
    )
    
    this.dashboardService.getTop().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      data => this.topInventory.set(data)
    )
  }
  
  onSearchByTag(tag: string) {
    this.router.navigate(['/search'], { queryParams: { tag: tag } });
  }
  
}
