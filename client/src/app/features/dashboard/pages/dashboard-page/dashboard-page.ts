import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
import { AuthService } from '../../../../core/services/auth.service';
import { Loader } from '../../../../shared/components/loader/loader';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  imports: [LastInventory, TopInventory, Tags, CommonModule, MatButtonModule, TranslateModule, MatIconModule, RouterLink, Loader],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  private dashboardService = inject(DashboardService)
  private authService = inject(AuthService)
  private router = inject(Router)
  private destroyRef = inject(DestroyRef);
  
  public isLoading = signal(false);
  public tags = signal<Tag[]>([]);
  public latestInventory = signal<Inventory[]>([]);
  public topInventory = signal<Inventory[]>([]);
  public isAuthenticated = computed(() => this.authService.isAuthenticated());
  
  ngOnInit(): void {
    this.isLoading.set(true); 
    
    forkJoin({
      latest: this.dashboardService.getLatest(),
      top: this.dashboardService.getTop(),
      tags: this.dashboardService.getTags()
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(()=> this.isLoading.set(false))
    ).subscribe({
      next: (data) => { 
        this.latestInventory.set(data.latest)
        this.topInventory.set(data.top)
        this.tags.set(data.tags)
      },
      error: (err)=> {}
    })
  }
  
  onSearchByTag(tag: string) {
    this.router.navigate(['/search'], { queryParams: { tag: tag } });
  }
  
}
